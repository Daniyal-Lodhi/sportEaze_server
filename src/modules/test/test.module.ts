import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { testUserEntity } from './entities/test.entity';
import { TestController } from './test.controller';
import { LoggerModule } from 'src/modules/logging/logger.module';

@Module({
  imports:[LoggerModule, TypeOrmModule.forFeature([testUserEntity])],
  providers: [TestService],
  controllers:[TestController]

})
export class TestModule {}
