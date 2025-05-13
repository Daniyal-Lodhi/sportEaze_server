import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { PatronService } from './patron.service';
import { JwtAuthGuard } from 'src/modules/auth/local-auth/jwt-auth.guard';
import { RegisterPatronDto } from './dto/register-patron.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdatePatronDto } from './dto/update-patron.dto';
import { VerifyPatronDto } from './dto/verify-patron.dto';

@Controller('/api/user/patron')
export class PatronController {
  constructor(private readonly patronService: PatronService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req, @Body() registerPatronDto: RegisterPatronDto) {
    const user = await this.patronService.create(req.user.id, registerPatronDto); 
    return { user, success: true };
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
    const user = await this.patronService.update(req.user.id, updatePatronDto);
    return  { user, success: true };

  }
  
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch("/verify/:patronId")
  async verify(@Param("patronId") patronId: string, @Request() req, @Body() verifyPatronDto: VerifyPatronDto) {
    return await this.patronService.verifyPatron(req.user.id, patronId, verifyPatronDto);
  }


  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get("/registrations")
  async getRegistration(@Request() req) {
    return await this.patronService.getPatrons(req.user.id);
  }


  @Get("/preferred")
  async getPreferredPatrons(@Request() req) {
    return await this.patronService.getPreferredPatrons();
  } 

}
