import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, Req } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/local-auth/jwt-auth.guard';

@Controller('/api/contracts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Post()
  create(@Request() req, @Body() createContractDto: CreateContractDto) {
    console.log('req.user', req.user);
    return this.contractsService.create(req.user.id, createContractDto);
  }

  @Get()
  async findAll(@Request() req) {
    return await this.contractsService.findAll(req.user.id);
  }

  @Get(':patronId')
  async findOne(@Request() req, @Param('patronId') id: string) {
    return await this.contractsService.findOne(req.user.id, id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateContractDto: UpdateContractDto) {
    return this.contractsService.update(+id, updateContractDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contractsService.remove(+id);
  }
}
