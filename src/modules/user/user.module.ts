import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { LocalAuthModule } from '../auth/local-auth/local-auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { LocalAuthService } from '../auth/local-auth/local-auth.service';
import { JwtModule } from '@nestjs/jwt';
import { response } from 'express';
import { WinstonLoggerService } from '../logging/winston-logger.service';
import { LoggerModule } from '../logging/logger.module';

@Module({
  imports:[TypeOrmModule.forFeature([User]),LocalAuthModule,JwtModule,LoggerModule],
  controllers: [UserController],
  providers: [UserService,LocalAuthService],
  exports:[]
})
export class UserModule {}
