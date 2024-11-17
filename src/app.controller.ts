import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,private configS:ConfigService) {}

  @Get()
  getHello(): string {
    console.log(this.configS.get('name'))
    return this.appService.getHello();
  }
}
