import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { KafkaModule } from '../../../infra/modules/messaging/kafka.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    KafkaModule,
  ],
  controllers: [],
  providers: [],
})
export class OrdersModule {}
