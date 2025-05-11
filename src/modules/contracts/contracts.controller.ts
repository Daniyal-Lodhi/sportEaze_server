import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, Req } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/local-auth/jwt-auth.guard';

@Controller('/api/contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  create(@Request() req, @Body() createContractDto: CreateContractDto) {
    return this.contractsService.create(req.user.id, createContractDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  async getContractsByUserId(@Request() req) {
    return await this.contractsService.getContractsByUserId(req.user.id);
  }
  
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('with-user/:userId')
  async getContractsWithPatron(@Param('userId') userId: string, @Request() req) {
    return await this.contractsService.getContractsWithUser(req.user.id, userId);
  }

  @Get('/:contractId')
  async getContractById(@Param('contractId') contractId: string, @Request() req) {
    return await this.contractsService.getContractById(contractId);
  }
}