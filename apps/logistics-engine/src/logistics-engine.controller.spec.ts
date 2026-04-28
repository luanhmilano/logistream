import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { LogisticsEngineController } from './logistics-engine.controller';
import { LogisticsEngineService } from './logistics-engine.service';
import { ORDER_PROJECTION_MODEL_NAME } from '../../../libs/common/index';

describe('LogisticsEngineController', () => {
  let logisticsEngineController: LogisticsEngineController;
  let logisticsEngineService: LogisticsEngineService;
  let projectionModel: {
    updateOne: jest.Mock;
    findOne: jest.Mock;
  };

  beforeEach(async () => {
    projectionModel = {
      updateOne: jest.fn().mockResolvedValue(undefined),
      findOne: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue({
          orderId: 'order-1',
          lastStatus: 'CREATED',
          eventTimestamp: new Date('2026-04-28T00:00:00.000Z'),
          updatedAt: new Date('2026-04-28T00:00:00.000Z'),
        }),
      }),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [LogisticsEngineController],
      providers: [
        LogisticsEngineService,
        {
          provide: getModelToken(ORDER_PROJECTION_MODEL_NAME),
          useValue: projectionModel,
        },
      ],
    }).compile();

    logisticsEngineController = app.get<LogisticsEngineController>(
      LogisticsEngineController,
    );
    logisticsEngineService = app.get<LogisticsEngineService>(
      LogisticsEngineService,
    );
  });

  describe('getOrderProjection', () => {
    it('should return the projected order', async () => {
      const result =
        await logisticsEngineController.getOrderProjection('order-1');

      expect(projectionModel.findOne).toHaveBeenCalledWith(
        { orderId: 'order-1' },
        { _id: 0 },
      );
      expect(result?.orderId).toBe('order-1');
    });
  });

  describe('handleOrderCreated', () => {
    it('should upsert projection when an order.created event is consumed', async () => {
      await logisticsEngineService.handleOrderCreated({
        orderId: 'order-2',
        status: 'CREATED',
        timestamp: '2026-04-28T00:00:00.000Z',
      });

      expect(projectionModel.updateOne).toHaveBeenCalledTimes(1);
    });
  });
});
