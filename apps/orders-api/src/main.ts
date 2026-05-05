import { NestFactory } from '@nestjs/core';
import { OrdersApiModule } from './orders-api.module';

async function bootstrap() {
  const app = await NestFactory.create(OrdersApiModule);
  await app.listen(process.env.ORDERS_API_PORT ?? 3001);
}
void bootstrap();
