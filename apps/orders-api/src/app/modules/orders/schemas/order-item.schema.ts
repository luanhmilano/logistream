import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OrderItemDocument = HydratedDocument<OrderItem>;

@Schema()
export class OrderItem {
  @Prop({ required: true })
  productId!: string;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  priceAtPurchase!: number;

  @Prop({ required: true, min: 1 })
  quantity!: number;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);
