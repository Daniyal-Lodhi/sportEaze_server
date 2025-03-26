import { Module } from '@nestjs/common';
import { PatronService } from './patron.service';
import { PatronController } from './patron.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patron } from './entities/patron.entity';
import { UserService } from '../user.service';
import { User } from '../entities/user.entity';
import { LocalAuthModule } from 'src/modules/auth/local-auth/local-auth.module';
import { LocalAuthService } from 'src/modules/auth/local-auth/local-auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Patron, User]), LocalAuthModule],
  controllers: [PatronController],
  providers: [PatronService, UserService],
})
export class PatronModule {}
