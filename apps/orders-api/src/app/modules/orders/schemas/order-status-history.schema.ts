import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OrderStatusHistoryDocument = HydratedDocument<OrderStatusHistory>;

@Schema()
export class OrderStatusHistory {
  @Prop({ required: true })
  status!: string;

  @Prop({ required: true })
  changedAt!: Date;
}

export const OrderStatusHistorySchema =
  SchemaFactory.createForClass(OrderStatusHistory);
