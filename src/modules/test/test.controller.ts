import { Body, Controller, Get, Post } from '@nestjs/common';
import { TestService } from './test.service';
import { CreateTestUserDto } from './dto/test.dto';
import { testUserEntity } from './entities/test.entity';

@Controller('/api') 
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Post('/createTestUser')
  async createUser(@Body() createUserDto:CreateTestUserDto): Promise<testUserEntity> {
    try{
    return await this.testService.createTestUser(createUserDto);
    }
    catch(error){
        console.log(error)
    }
  }
}
