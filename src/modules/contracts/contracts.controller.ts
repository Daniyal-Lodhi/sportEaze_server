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
    return this.contractsService.create(req.user.id, createContractDto);
  }

  @Get()
  async getContractsByUserId(@Request() req) {
    return await this.contractsService.getContractsByUserId(req.user.id);
  }

  @Get("/:userId")
  async getContractsWithPatron(@Param('userId') userId: string, @Request() req) {
    return await this.contractsService.getContractsWithUser(req.user.id, userId);
  }

}