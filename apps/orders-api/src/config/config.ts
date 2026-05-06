import { parseKafkaBrokers } from '../app/commons/utils/parse-kafka-brokers.util';

const {
  DEFAULT_MONGO_URI,
  ORDERS_API_PORT,
  ORDER_MODEL_NAME,
  ORDER_PROJECTION_MODEL_NAME,
  KAFKA_BROKERS,
  ORDER_CREATED_TOPIC,
  ORDER_STATUS_UPDATED_TOPIC,
  ORDERS_KAFKA_CLIENT,
} = process.env;

const getConfig = () => ({
  port: Number(ORDERS_API_PORT) || 3001,
  orderModelName: ORDER_MODEL_NAME || 'Order',
  orderProjectionModelName: ORDER_PROJECTION_MODEL_NAME || 'OrderProjection',
  dbConfig: {
    uri: DEFAULT_MONGO_URI || 'mongodb://localhost:27017/orders',
  },
  kafkaConfig: {
    brokers: KAFKA_BROKERS
      ? parseKafkaBrokers(KAFKA_BROKERS)
      : ['localhost:9092'],
    topics: {
      orderCreated: ORDER_CREATED_TOPIC || 'order.created',
      orderStatusUpdated: ORDER_STATUS_UPDATED_TOPIC || 'order.status.updated',
    },
    clientName: ORDERS_KAFKA_CLIENT || 'ORDERS_KAFKA_CLIENT',
  },
});

export default getConfig;
export type Config = ReturnType<typeof getConfig>;
