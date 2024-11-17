import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { WinstonLoggerService } from './modules/logging/winston-logger.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private configS:ConfigService,
    private readonly logger: WinstonLoggerService,
  ) {}

  @Get()
  getHello(): string {
    this.logger.log(this.configS.get('name'))
    return this.appService.getHello();
  }
}
