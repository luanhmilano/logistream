import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { LogisticsEngineModule } from './logistics-engine.module';
import {
  DEFAULT_KAFKA_BROKERS,
  parseKafkaBrokers,
} from '../../../libs/common/index';

async function bootstrap() {
  const app = await NestFactory.create(LogisticsEngineModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'logistics-engine',
        brokers: parseKafkaBrokers(
          process.env.KAFKA_BROKERS ?? DEFAULT_KAFKA_BROKERS,
        ),
      },
      consumer: {
        groupId: 'logistics-engine-consumer',
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.LOGISTICS_ENGINE_PORT ?? 3002);
}
void bootstrap();
