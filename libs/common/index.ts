export const DEFAULT_KAFKA_BROKERS = 'localhost:9092';
export const DEFAULT_MONGO_URI = 'mongodb://localhost:27017/logistream';

export const ORDER_CREATED_TOPIC = 'order.created';
export const ORDER_STATUS_UPDATED_TOPIC = 'order.status.updated';
export const ORDERS_KAFKA_CLIENT = 'ORDERS_KAFKA_CLIENT';
export const ORDER_MODEL_NAME = 'Order';
export const ORDER_PROJECTION_MODEL_NAME = 'OrderProjection';

export const ORDER_STATUSES = ['PENDING', 'IN_ROUTE', 'DELIVERED'] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

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

export const parseKafkaBrokers = (brokers: string): string[] =>
  brokers
    .split(',')
    .map((broker) => broker.trim())
    .filter(Boolean);
