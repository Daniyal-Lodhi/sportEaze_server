import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { envFilePath } from './config/env.config';
import { DatabaseModule } from './config/database/database.module';
import { TestModule } from './modules/test/test.module';
import { WinstonLoggerService } from './modules/logging/winston-logger.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './modules/logging/logging.interceptor';
import { LoggerModule } from './modules/logging/logger.module';




@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
    }),
    DatabaseModule,
    TestModule,
  ],
  controllers: [AppController],
  providers: [AppService, WinstonLoggerService, {
    provide: APP_INTERCEPTOR,
    useClass: LoggingInterceptor
  }]
})
export class AppModule { }
