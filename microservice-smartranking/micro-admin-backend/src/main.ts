import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import momentTimezone from 'moment-timezone';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [
        `amqp://${configService.get<string>(
          'RABBITMQ_USER',
        )}:${configService.get<string>(
          'RABBITMQ_PASSWORD',
        )}@${configService.get<string>('RABBITMQ_URL')}`,
      ],
      noAck: false,
      queue: 'admin-backend',
    },
  });

  Date.prototype.toJSON = function (): any {
    return momentTimezone(this)
      .tz('America/Sao_Paulo')
      .format('YYYY-MM-DD HH:mm:ss.SSS');
  };

  await app.listen();
}
bootstrap();
