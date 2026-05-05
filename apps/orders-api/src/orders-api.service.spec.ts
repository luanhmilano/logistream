/// <reference types="jest" />

import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { of } from 'rxjs';
import { OrdersApiService } from './orders-api.service';
import {
  ORDER_MODEL_NAME,
  ORDERS_KAFKA_CLIENT,
} from '../../../libs/common/index';

describe('OrdersApiService', () => {
  let service: OrdersApiService;
  let orderModel: {
    create: jest.Mock;
    findOne: jest.Mock;
    updateOne: jest.Mock;
  };
  let kafkaClient: { emit: jest.Mock };

  beforeEach(async () => {
    orderModel = {
      create: jest.fn(),
      findOne: jest.fn(),
      updateOne: jest.fn(),
    };

    kafkaClient = {
      emit: jest.fn().mockReturnValue(of(undefined)),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersApiService,
        { provide: getModelToken(ORDER_MODEL_NAME), useValue: orderModel },
        { provide: ORDERS_KAFKA_CLIENT, useValue: kafkaClient },
      ],
    }).compile();

    service = moduleRef.get(OrdersApiService);
  });

  describe('createOrder', () => {
    it('should persist a pending order and emit the creation event', async () => {
      orderModel.create.mockResolvedValue(undefined);

      const result = await service.createOrder();

      expect(orderModel.create).toHaveBeenCalledTimes(1);
      expect(kafkaClient.emit).toHaveBeenCalledTimes(1);
      expect(result.status).toBe('PENDING');
      expect(result.orderId).toBeDefined();
      expect(result.timestamp).toBeDefined();
    });

    it('should reject invalid status values', async () => {
      await expect(service.createOrder({ status: 'INVALID' })).rejects.toThrow(
        /status must be one of/,
      );
    });
  });

  describe('getOrder', () => {
    it('should return an order when it exists', async () => {
      orderModel.findOne.mockReturnValue({
        lean: jest.fn().mockResolvedValue({
          orderId: 'order-1',
          status: 'PENDING',
        }),
      });

      const result = await service.getOrder('order-1');

      expect(orderModel.findOne).toHaveBeenCalledWith(
        { orderId: 'order-1' },
        { _id: 0 },
      );
      expect(result.status).toBe('PENDING');
    });
  });

  describe('handleOrderStatusUpdated', () => {
    it('should update the order status history and emit the audit event', async () => {
      orderModel.updateOne.mockResolvedValue(undefined);

      await service.handleOrderStatusUpdated({
        orderId: 'order-1',
        status: 'IN_ROUTE',
        previousStatus: 'PENDING',
        timestamp: new Date().toISOString(),
      });

      expect(orderModel.updateOne).toHaveBeenCalledTimes(1);
      expect(kafkaClient.emit).toHaveBeenCalledTimes(1);
    });
  });
});
