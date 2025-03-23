import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { PatronService } from './patron.service';
import { JwtAuthGuard } from 'src/modules/auth/local-auth/jwt-auth.guard';
import { RegisterPatronDto } from './dto/register-patron.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdatePatronDto } from './dto/update-patron.dto';

@Controller('/api/user/patron')
export class PatronController {
  constructor(private readonly patronService: PatronService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req, @Body() registerPatronDto: RegisterPatronDto) {
    return await this.patronService.create(req.user.id, registerPatronDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  async get(@Request() req) {
    return await this.patronService.getPatronById(req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch()
  async update(@Request() req, @Body() updatePatronDto: UpdatePatronDto) {
    return await this.patronService.update(req.user.id, updatePatronDto);
  }
}
