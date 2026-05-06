export const DEFAULT_KAFKA_BROKERS = 'localhost:9092';

export const ORDER_CREATED_TOPIC = 'order.created';
export const ORDER_STATUS_UPDATED_TOPIC = 'order.status.updated';
export const ORDERS_KAFKA_CLIENT = 'ORDERS_KAFKA_CLIENT';

export const parseKafkaBrokers = (brokers: string): string[] =>
  brokers
    .split(',')
    .map((broker) => broker.trim())
    .filter(Boolean);
