import { Module } from '@nestjs/common';
import { MentorService } from './mentor.service';
import { MentorController } from './mentor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mentor } from './entities/mentor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Mentor])],
  controllers: [MentorController],
  providers: [MentorService],
})
export class MentorModule {}
