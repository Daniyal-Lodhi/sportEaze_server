import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { MentorService } from './mentor.service';
import { RegisterMentorDto } from './dto/register-mentor.dto';
import { UpdateMentorDto } from './dto/update-mentor.dto';
import { JwtAuthGuard } from 'src/modules/auth/local-auth/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { EndorseDto } from './dto/endorse.dto';

@Controller('/api/user/mentor')
export class MentorController {
  constructor(private readonly mentorService: MentorService) {}
  
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req,  @Body() createMentorDto: RegisterMentorDto) {
    return this.mentorService.create(req.user.id, createMentorDto);
  }
  
  @Patch()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  update(@Request() req, @Body() updateMentorDto: UpdateMentorDto) {
    return this.mentorService.update(req.user.id, updateMentorDto);
  }
  
  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
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


  @Get('/endorsements/:mentorId')
  async getEndorsements(@Param('mentorId') mentorId: string) {
    return await this.mentorService.getEndorsements(mentorId);
  }


  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get("/preferred")
  async getPreferredMentors(@Request() req) {
    if (!req.user || !req.user.id) {
      throw new UnauthorizedException("Invalid user credentials");
    }
    
    return await this.mentorService.getPreferredMentors(req.user.id);
  }
}
