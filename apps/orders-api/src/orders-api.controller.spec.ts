import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { of } from 'rxjs';
import { OrdersApiController } from './orders-api.controller';
import { OrdersApiService } from './orders-api.service';
import {
  ORDER_MODEL_NAME,
  ORDERS_KAFKA_CLIENT,
} from '../../../libs/common/index';

describe('OrdersApiController', () => {
  let ordersApiController: OrdersApiController;
  let orderModel: { create: jest.Mock };
  let kafkaClient: { emit: jest.Mock };

  beforeEach(async () => {
    orderModel = {
      create: jest.fn().mockResolvedValue(undefined),
    };

    kafkaClient = {
      emit: jest.fn().mockReturnValue(of(undefined)),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [OrdersApiController],
      providers: [
        OrdersApiService,
        { provide: getModelToken(ORDER_MODEL_NAME), useValue: orderModel },
        { provide: ORDERS_KAFKA_CLIENT, useValue: kafkaClient },
      ],
    }).compile();

    ordersApiController = app.get<OrdersApiController>(OrdersApiController);
  });

  describe('createOrder', () => {
    it('should persist and emit an order.created event', async () => {
      const result = await ordersApiController.createOrder({
        status: 'CREATED',
      });

      expect(orderModel.create).toHaveBeenCalledTimes(1);
      expect(kafkaClient.emit).toHaveBeenCalledTimes(1);
      expect(result.status).toBe('CREATED');
      expect(result.orderId).toBeDefined();
      expect(result.timestamp).toBeDefined();
    });
  });
});
