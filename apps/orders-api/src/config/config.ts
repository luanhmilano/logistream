const {
  DEFAULT_MONGO_URI,
  ORDERS_API_PORT,
  ORDER_MODEL_NAME,
  ORDER_PROJECTION_MODEL_NAME,
} = process.env;

const getConfig = () => ({
  port: Number(ORDERS_API_PORT) || 3001,
  orderModelName: ORDER_MODEL_NAME || 'Order',
  orderProjectionModelName: ORDER_PROJECTION_MODEL_NAME || 'OrderProjection',
  dbConfig: {
    uri: DEFAULT_MONGO_URI || 'mongodb://localhost:27017/logistream',
  },
});

export default getConfig;
export type Config = ReturnType<typeof getConfig>;
