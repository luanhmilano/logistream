import { Test, TestingModule } from '@nestjs/testing';
import { OrdersApiController } from './orders-api.controller';
import { OrdersApiService } from './orders-api.service';

describe('OrdersApiController', () => {
  let ordersApiController: OrdersApiController;
  let ordersApiService: { createOrder: jest.Mock; getOrder: jest.Mock };

  beforeEach(async () => {
    ordersApiService = {
      createOrder: jest.fn(),
      getOrder: jest.fn(),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [OrdersApiController],
      providers: [{ provide: OrdersApiService, useValue: ordersApiService }],
    }).compile();

    ordersApiController = app.get<OrdersApiController>(OrdersApiController);
  });

  describe('createOrder', () => {
    it('should delegate order creation to the service', async () => {
      ordersApiService.createOrder.mockResolvedValue({
        orderId: 'order-1',
        status: 'PENDING',
        timestamp: new Date().toISOString(),
      });

      const result = await ordersApiController.createOrder({});

      expect(ordersApiService.createOrder).toHaveBeenCalledTimes(1);
      expect(result.orderId).toBe('order-1');
    });
  });

  describe('getOrder', () => {
    it('should delegate order lookup to the service', async () => {
      ordersApiService.getOrder.mockResolvedValue({
        orderId: 'order-1',
        status: 'PENDING',
      });

      const result = await ordersApiController.getOrder('order-1');

      expect(ordersApiService.getOrder).toHaveBeenCalledWith('order-1');
      expect(result.status).toBe('PENDING');
    });
  });
});
