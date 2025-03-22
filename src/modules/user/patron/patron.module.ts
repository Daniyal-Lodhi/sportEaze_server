import { Module } from '@nestjs/common';
import { PatronService } from './patron.service';
import { PatronController } from './patron.controller';

@Module({
  controllers: [PatronController],
  providers: [PatronService],
})
export class PatronModule {}
