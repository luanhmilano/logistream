import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientKafka } from '@nestjs/microservices';
import { randomUUID } from 'node:crypto';
import { Model } from 'mongoose';
import {
  ORDER_CREATED_TOPIC,
  ORDERS_KAFKA_CLIENT,
  OrderCreatedEvent,
} from '../../../libs/common/index';

interface OrderDocument {
  orderId: string;
  status: string;
  createdAt: Date;
}

export interface CreateOrderInput {
  status?: string;
}

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
    const status = input.status ?? 'CREATED';
    const createdAt = new Date();

    await this.orderModel.create({
      orderId,
      status,
      createdAt,
    });

    const event: OrderCreatedEvent = {
      orderId,
      status,
      timestamp: createdAt.toISOString(),
    };

    this.kafkaClient.emit(ORDER_CREATED_TOPIC, event);

    return event;
  }
}
