import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrdersApiController } from './orders-api.controller';
import { OrdersApiService } from './orders-api.service';
import getConfig from './config/config';
import { KafkaModule } from './infra/modules/messaging/kafka.module';
import { DatabaseModule } from './infra/modules/database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [getConfig],
      isGlobal: true,
      expandVariables: true,
    }),
    KafkaModule,
    DatabaseModule,
  ],
  controllers: [OrdersApiController],
  providers: [OrdersApiService],
})
export class OrdersApiModule {}
