import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { MentorService } from './mentor.service';
import { RegisterMentorDto } from './dto/register-mentor.dto';
import { UpdateMentorDto } from './dto/update-mentor.dto';
import { JwtAuthGuard } from 'src/modules/auth/local-auth/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { EndorseDto } from './dto/endorse.dto';

@Controller('/api/user/mentor')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class MentorController {
  constructor(private readonly mentorService: MentorService) {}

  @Post()
  create(@Request() req,  @Body() createMentorDto: RegisterMentorDto) {
    return this.mentorService.create(req.user.id, createMentorDto);
  }

  @Patch()
  update(@Request() req, @Body() updateMentorDto: UpdateMentorDto) {
    return this.mentorService.update(req.user.id, updateMentorDto);
  }

  @Get()
  get(@Request() req) {
    console.log(req);
    return this.mentorService.getMentorById(req.user.id);
  }

    @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post("/endorse")
  async endorse(@Request() req, @Body() body: EndorseDto) {
    return await this.mentorService.endorsePlayer(req.user.id, body);
  }

}
