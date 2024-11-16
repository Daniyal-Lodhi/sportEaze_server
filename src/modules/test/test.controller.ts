import { Body, Controller, Get, Post } from '@nestjs/common';
import { TestService } from './test.service';
import { CreateTestUserDto } from './dto/test.dto';
import { testUserEntity } from './entities/test.entity';
import { WinstonLoggerService } from 'src/modules/logging/winston-logger.service';

@Controller('/api') 
export class TestController {
  constructor(private readonly testService: TestService, private readonly logger: WinstonLoggerService) {}

  @Post('/createTestUser')
  async createUser(@Body() createUserDto:CreateTestUserDto): Promise<testUserEntity> {
    try{
      this.logger.log("creating a test user", "TestController");
    return await this.testService.createTestUser(createUserDto);
    }
    catch(error){
        console.log(error)
    }
  }

  @Get("")
  hello()
  {
    return {a: 1};
  }
}
