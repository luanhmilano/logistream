import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Model } from 'mongoose';
import {
  ORDER_CREATED_TOPIC,
  ORDER_PROJECTION_MODEL_NAME,
} from '../../../libs/common/index';
import type { OrderCreatedEvent } from '../../../libs/common/index';

interface OrderProjectionDocument {
  orderId: string;
  lastStatus: string;
  eventTimestamp: Date;
  updatedAt: Date;
}

@Injectable()
export class LogisticsEngineService {
  constructor(
    @InjectModel(ORDER_PROJECTION_MODEL_NAME)
    private readonly orderProjectionModel: Model<OrderProjectionDocument>,
  ) {}

  @MessagePattern(ORDER_CREATED_TOPIC)
  async handleOrderCreated(@Payload() event: OrderCreatedEvent): Promise<void> {
    await this.orderProjectionModel.updateOne(
      { orderId: event.orderId },
      {
        $set: {
          lastStatus: event.status,
          eventTimestamp: new Date(event.timestamp),
          updatedAt: new Date(),
        },
      },
      { upsert: true },
    );
  }

  async getOrderProjection(orderId: string) {
    return this.orderProjectionModel.findOne({ orderId }, { _id: 0 }).lean();
  }
}
