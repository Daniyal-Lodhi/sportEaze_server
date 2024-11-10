import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { testUserEntity } from './entities/test.entity';
import { TestController } from './test.controller';

@Module({
  imports:[TypeOrmModule.forFeature([testUserEntity])],
  providers: [TestService],
  controllers:[TestController]

})
export class TestModule {}
