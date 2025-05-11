import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, Req, Query, UsePipes, ValidationPipe, ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/local-auth/jwt-auth.guard';
import { ContractStatus } from 'src/common/enums/contracts/contracts.enum';
import { ContractStatusValidationPipe } from 'src/common/customValidation/ContractStatusValidationPipe';


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
  async getContractsByUserId(@Request() req, @Query("filter", new ContractStatusValidationPipe()) filter: ContractStatus | 0) {
    return await this.contractsService.getContractsByUserId(req.user.id, filter);
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

  @Patch("/accept/:contractId")
  async acceptContract(@Param('contractId') contractId: string, @Request() req) {
    return await this.contractsService.acceptContract(contractId, req.user.id);
  }
}