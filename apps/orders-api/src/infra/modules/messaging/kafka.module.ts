import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ORDERS_KAFKA_CLIENT } from '../../../app/modules/orders/constants/orders-kafka-client.constant';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: ORDERS_KAFKA_CLIENT,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'orders-api',
              brokers: configService.get<string[]>('kafkaConfig.brokers') ?? [
                'localhost:9092',
              ],
            },
          },
        }),
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class KafkaModule {}
