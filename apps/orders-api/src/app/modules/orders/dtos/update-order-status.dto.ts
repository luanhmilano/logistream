import { IsEnum } from 'class-validator';
import * as orderSchema from '../schemas/order.schema';

export class UpdateOrderStatusDto {
  @IsEnum(orderSchema.ORDER_STATUSES, {
    message: `Status inválido. Valores aceitos: ${orderSchema.ORDER_STATUSES.join(', ')}`,
  })
  status: orderSchema.OrderStatus;
}
