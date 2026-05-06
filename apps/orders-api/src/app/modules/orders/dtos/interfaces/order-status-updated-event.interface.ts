import { OrderStatus } from '../../constants/order-statuses.constant';

export interface OrderStatusUpdatedEvent {
  orderId: string;
  status: OrderStatus;
  previousStatus: OrderStatus;
  timestamp: string;
}
