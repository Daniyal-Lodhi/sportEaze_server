import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { MentorService } from './mentor.service';
import { RegisterMentorDto } from './dto/register-mentor.dto';
import { UpdateMentorDto } from './dto/update-mentor.dto';
import { JwtAuthGuard } from 'src/modules/auth/local-auth/jwt-auth.guard';

@Controller('/api/user/mentor')
export class MentorController {
  constructor(private readonly mentorService: MentorService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Request() req,  @Body() createMentorDto: RegisterMentorDto) {
    return this.mentorService.create(req.user.id, createMentorDto);
  }

  @Patch()
  update(@Request() req, @Body() updateMentorDto: UpdateMentorDto) {
    return this.mentorService.update(req.user.id, updateMentorDto);
  }
}
