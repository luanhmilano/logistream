import { IsEnum } from 'class-validator';
import * as orderStatusesConstant from '../constants/order-statuses.constant';

export class UpdateOrderStatusDto {
  @IsEnum(orderStatusesConstant.ORDER_STATUSES, {
    message: `Status inválido. Valores aceitos: ${orderStatusesConstant.ORDER_STATUSES.join(', ')}`,
  })
  status!: orderStatusesConstant.OrderStatus;
}
