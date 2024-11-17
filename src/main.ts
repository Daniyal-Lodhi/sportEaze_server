import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { WinstonLoggerService } from './modules/logging/winston-logger.service';

async function bootstrap() {
  const appLogger = new WinstonLoggerService();

  const app = await NestFactory.create(AppModule, {
    logger: appLogger
  });
  
  app.useGlobalPipes(new ValidationPipe());
  
  await app.listen(3000);
  
  appLogger.log("NestJS application started on port 3000", "Bootstrap");
}

bootstrap();