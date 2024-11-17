import { Module } from '@nestjs/common';
import { GoogleAuthService } from './google-auth.service';

@Module({
  controllers: [],
  providers: [GoogleAuthService],
})
export class GoogleAuthModule {}
