import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { Schema } from 'mongoose';
import { OrdersApiController } from './orders-api.controller';
import { OrdersApiService } from './orders-api.service';
import {
  DEFAULT_KAFKA_BROKERS,
  DEFAULT_MONGO_URI,
  ORDER_MODEL_NAME,
  ORDERS_KAFKA_CLIENT,
  parseKafkaBrokers,
} from '../../../libs/common/index';

const OrderSchema = new Schema(
  {
    orderId: { type: String, required: true, unique: true },
    status: { type: String, required: true },
    createdAt: { type: Date, required: true },
  },
  { versionKey: false },
);

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ClientsModule.registerAsync([
      {
        name: ORDERS_KAFKA_CLIENT,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'orders-api',
              brokers: parseKafkaBrokers(
                configService.get<string>('KAFKA_BROKERS') ??
                  DEFAULT_KAFKA_BROKERS,
              ),
            },
          },
        }),
      },
    ]),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI') ?? DEFAULT_MONGO_URI,
      }),
    }),
    MongooseModule.forFeature([
      { name: ORDER_MODEL_NAME, schema: OrderSchema },
    ]),
  ],
  controllers: [OrdersApiController],
  providers: [OrdersApiService],
})
export class OrdersApiModule {}
