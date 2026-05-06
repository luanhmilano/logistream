export const ORDER_STATUSES = [
  'PENDING',
  'IN_TRANSIT',
  'DELIVERED',
  'DELAYED',
  'CANCELED',
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];
