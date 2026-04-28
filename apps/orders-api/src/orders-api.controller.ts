import { Body, Controller, Post } from '@nestjs/common';
import { OrdersApiService } from './orders-api.service';

@Controller()
export class OrdersApiController {
  constructor(private readonly ordersApiService: OrdersApiService) {}

  @Post('orders')
  async createOrder(@Body() body: { status?: string }) {
    return this.ordersApiService.createOrder(body);
  }
}
