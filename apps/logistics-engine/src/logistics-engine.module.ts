import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Schema } from 'mongoose';
import { LogisticsEngineController } from './logistics-engine.controller';
import { LogisticsEngineService } from './logistics-engine.service';
import {
  DEFAULT_MONGO_URI,
  ORDER_PROJECTION_MODEL_NAME,
} from '../../../libs/common/index';

const OrderProjectionSchema = new Schema(
  {
    orderId: { type: String, required: true, unique: true },
    lastStatus: { type: String, required: true },
    eventTimestamp: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
  },
  { versionKey: false },
);

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI') ?? DEFAULT_MONGO_URI,
      }),
    }),
    MongooseModule.forFeature([
      { name: ORDER_PROJECTION_MODEL_NAME, schema: OrderProjectionSchema },
    ]),
  ],
  controllers: [LogisticsEngineController],
  providers: [LogisticsEngineService],
})
export class LogisticsEngineModule {}
