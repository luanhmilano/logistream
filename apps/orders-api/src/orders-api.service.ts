import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientKafka } from '@nestjs/microservices';
import { randomUUID } from 'node:crypto';
import { Model } from 'mongoose';
import { firstValueFrom } from 'rxjs';
import {
  ORDER_CREATED_TOPIC,
  ORDER_STATUS_UPDATED_TOPIC,
  ORDER_STATUSES,
  ORDERS_KAFKA_CLIENT,
  OrderCreatedEvent,
  OrderStatus,
  OrderStatusUpdatedEvent,
} from '../../../libs/common/index';

export interface OrderDocument {
  orderId: string;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  statusHistory: Array<{
    status: OrderStatus;
    changedAt: Date;
  }>;
}

export interface CreateOrderInput {
  status?: string;
}

const DEFAULT_ORDER_STATUS: OrderStatus = 'PENDING';

const isOrderStatus = (value: string): value is OrderStatus =>
  (ORDER_STATUSES as readonly string[]).includes(value);

const resolveOrderStatus = (status?: string): OrderStatus => {
  if (!status) {
    return DEFAULT_ORDER_STATUS;
  }

  if (!isOrderStatus(status)) {
    throw new BadRequestException(
      `status must be one of ${ORDER_STATUSES.join(', ')}`,
    );
  }

  return status;
};

@Injectable()
export class OrdersApiService {
  constructor(
    @InjectModel('Order')
    private readonly orderModel: Model<OrderDocument>,
    @Inject(ORDERS_KAFKA_CLIENT)
    private readonly kafkaClient: ClientKafka,
  ) {}

  async createOrder(input: CreateOrderInput = {}): Promise<OrderCreatedEvent> {
    const orderId = randomUUID();
    const status = resolveOrderStatus(input.status);
    const createdAt = new Date();

    await this.orderModel.create({
      orderId,
      status,
      createdAt,
      updatedAt: createdAt,
      statusHistory: [
        {
          status,
          changedAt: createdAt,
        },
      ],
    });

    const event: OrderCreatedEvent = {
      orderId,
      status,
      timestamp: createdAt.toISOString(),
    };

    await firstValueFrom(this.kafkaClient.emit(ORDER_CREATED_TOPIC, event));

    return event;
  }

  async getOrder(orderId: string) {
    const order = await this.orderModel.findOne({ orderId }, { _id: 0 }).lean();

    if (!order) {
      throw new NotFoundException(`Order ${orderId} was not found`);
    }

    return order;
  }

  async handleOrderStatusUpdated(
    event: OrderStatusUpdatedEvent,
  ): Promise<void> {
    const eventTimestamp = new Date(event.timestamp);

    await this.orderModel.updateOne(
      { orderId: event.orderId },
      {
        $set: {
          status: event.status,
          updatedAt: eventTimestamp,
        },
        $setOnInsert: {
          orderId: event.orderId,
          createdAt: eventTimestamp,
          statusHistory: [],
        },
        $push: {
          statusHistory: {
            status: event.status,
            changedAt: eventTimestamp,
          },
        },
      },
      { upsert: true },
    );

    await firstValueFrom(
      this.kafkaClient.emit(ORDER_STATUS_UPDATED_TOPIC, event),
    );
  }
}
