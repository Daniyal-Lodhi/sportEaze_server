import { Module } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { ContractsController } from './contracts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Milestone } from './entities/milestones.entity';
import { Contract } from './entities/contract.entity';
import { User } from '../user/entities/user.entity';
import { ContractSocketHandler } from './contract.socket.handler';

@Module({
  imports: [TypeOrmModule.forFeature([User, Contract, Milestone])],
  controllers: [ContractsController],
  providers: [ContractsService, ContractSocketHandler],
  exports: [ContractsService],
})
export class ContractsModule {}
