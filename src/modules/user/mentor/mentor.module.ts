import { Module } from '@nestjs/common';
import { MentorService } from './mentor.service';
import { MentorController } from './mentor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mentor } from './entities/mentor.entity';
import { NetworkModule } from '../network/network.module';
import { UserService } from '../user.service';
import { User } from '../entities/user.entity';
import { LocalAuthModule } from 'src/modules/auth/local-auth/local-auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Mentor, User]), LocalAuthModule, NetworkModule],
  controllers: [MentorController],
  providers: [MentorService, UserService],
})
export class MentorModule {}
