import { Controller, Post, Body, Patch, UseGuards, HttpException, HttpStatus, Req } from '@nestjs/common';
import { RegisterUserDto } from '../dto/register-user.dto';
import { UserService } from '../user.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/local-auth/jwt-auth.guard';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserType } from 'src/common/enums/user/user-type.enum';

@Controller('/api/user/fan')
export class FanController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  async create(@Req() req, @Body() createFanDto: RegisterUserDto) {
    const userId = req.user?.id;

    if (!userId) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    return await this.userService.updateUser(userId, createFanDto, UserType.FAN);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch()
  async updateUser(@Req() req, @Body() updateFanDto: UpdateUserDto) {
    const userId = req.user?.id;

    if (!userId) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    return await this.userService.updateUser(userId, updateFanDto, UserType.FAN);
  }

}
