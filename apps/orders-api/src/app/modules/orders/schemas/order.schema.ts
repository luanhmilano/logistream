import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Destination } from './destination.schema';
import mongoose, { HydratedDocument } from 'mongoose';
import { OrderItem } from './order-item.schema';
import { ORDER_STATUSES } from '../constants/order-statuses.constant';

export type OrderDocument = HydratedDocument<Order>;

@Schema()
export class Order {
  @Prop({ required: true, unique: true })
  orderId!: string;

  @Prop({ required: true })
  customerId!: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Destination' }],
    required: true,
  })
  destination!: Destination;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OrderItem' }],
    required: true,
    validate: [
      (v: any[]) => v.length > 0,
      'O pedido precisa ter pelo menos um item',
    ],
  })
  items!: OrderItem[];

  @Prop({
    required: true,
    enum: ORDER_STATUSES,
    default: 'PENDING',
  })
  status!: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OrderStatusHistory' }],
  })
  statusHistory!: { status: string; changedAt: Date }[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);
