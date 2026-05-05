import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrdersApiService, OrderDocument } from './orders-api.service';

@Controller()
export class OrdersApiController {
  constructor(private readonly ordersApiService: OrdersApiService) {}

  @Post('orders')
  async createOrder(@Body() body: { status?: string }) {
    return this.ordersApiService.createOrder(body);
  }

  @Get('orders/:orderId')
  async getOrder(@Param('orderId') orderId: string): Promise<OrderDocument> {
    return this.ordersApiService.getOrder(orderId);
  }
}
