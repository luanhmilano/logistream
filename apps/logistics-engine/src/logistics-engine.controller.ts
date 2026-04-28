import { Controller, Get, Param } from '@nestjs/common';
import { LogisticsEngineService } from './logistics-engine.service';

@Controller()
export class LogisticsEngineController {
  constructor(
    private readonly logisticsEngineService: LogisticsEngineService,
  ) {}

  @Get('orders/:orderId')
  async getOrderProjection(@Param('orderId') orderId: string) {
    return this.logisticsEngineService.getOrderProjection(orderId);
  }
}
