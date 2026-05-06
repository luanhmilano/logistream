import { Schema } from 'mongoose';

export const ORDER_STATUSES = [
  'PENDING',
  'IN_TRANSIT',
  'DELIVERED',
  'DELAYED',
  'CANCELED',
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const OrderStatusHistorySchema = new Schema(
  {
    status: { type: String, required: true },
    changedAt: { type: Date, required: true },
  },
  { _id: false },
);

export const OrderItemSchema = new Schema(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    priceAtPurchase: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

export const DestinationSchema = new Schema(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String, required: true },
  },
  { _id: false },
);

export const OrderSchema = new Schema(
  {
    orderId: { type: String, required: true, unique: true },
    customerId: { type: String, required: true },
    destination: { type: DestinationSchema, required: true },
    items: {
      type: [OrderItemSchema],
      required: true,
      validate: [
        (v: any[]) => v.length > 0,
        'O pedido precisa ter pelo menos um item',
      ],
    },
    status: {
      type: String,
      enum: ORDER_STATUSES,
      required: true,
      default: 'PENDING',
    },
    statusHistory: {
      type: [OrderStatusHistorySchema],
      default: [],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export interface OrderCreatedEvent {
  orderId: string;
  status: string;
  timestamp: string;
}

export interface OrderStatusUpdatedEvent {
  orderId: string;
  status: OrderStatus;
  previousStatus: OrderStatus;
  timestamp: string;
}
