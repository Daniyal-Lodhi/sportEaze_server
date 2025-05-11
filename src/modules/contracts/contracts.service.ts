import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { Contract } from './entities/contract.entity';
import { ContractStatus } from 'src/common/enums/contracts/contracts.enum';
import { Milestone } from './entities/milestones.entity';
import { contains } from 'class-validator';
import { NotFoundError } from 'rxjs';

@Injectable()
export class ContractsService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>, 
    @InjectRepository(Contract)
    private contractRepo: Repository<Contract>,
    @InjectRepository(Milestone)
    private milestoneRepo: Repository<Milestone>,

  ) {}
  
  async create(patronId: string, createContractDto: CreateContractDto) {
    const patron = await this.userRepo.findOne({ where: { id: patronId } });
    const player = await this.userRepo.findOne({ where: { id: createContractDto.playerId } });
  
    if (!patron || !player) {
      throw new Error('Patron or Player not found');
    }
  
    // Prepare milestone entities
    const milestones = createContractDto.milestones.map(milestoneDto =>
      this.milestoneRepo.create({ ...milestoneDto }) // Contract will be added after
    );
  
    let contract = this.contractRepo.create({
      ...createContractDto,
      status: ContractStatus.PENDING,
      patron,
      player,
      milestones, // attach milestones
    });
  
    // Save contract first so it gets an ID
    const savedContract = await this.contractRepo.save(contract);
  
    // Set contract reference and save milestones
    for (const milestone of milestones) {
      milestone.contract = savedContract;
      await this.milestoneRepo.save(milestone);
    }
    
    contract = await this.contractRepo.findOne({
      where: { id: savedContract.id },
      relations: ['milestones', 'patron', 'player', 'patron.user', 'player.user'],
    });

    return {
      ...contract,
      patron: {
        id: contract.patron.user.id,
        profilePicUrl: contract.patron.user.profilePicUrl,
        fullName: contract.patron.user.fullName,
        username: contract.patron.user.username,
        userType: contract.patron.user.userType,
      },
      player: {
        id: contract.player.user.id,
        profilePicUrl: contract.player.user.profilePicUrl,
        fullName: contract.player.user.fullName,
        username: contract.player.user.username,
        userType: contract.player.user.userType,

      },
    }
  }
  
  async getContractsByUserId(id: string, filter: number) {
    let contracts;

    if (filter === 0) {
      contracts = await this.contractRepo.find({
        where: [{ player: { id }}, { patron: { id } }],
        relations: ['milestones', 'patron', 'player', 'patron.user', 'player.user'],
      });
    } else {
      contracts = await this.contractRepo.find({
        where: [{ player: { id }, status: filter }, { patron: { id }, status: filter }],
        relations: ['milestones', 'patron', 'player', 'patron.user', 'player.user'],
      });
    }

    if (!contracts || contracts.length === 0) {
      return [];
    }

    return contracts.map(contract => ({
      ...contract,
      patron: {
        id: contract.patron.user.id,
        profilePicUrl: contract.patron.user.profilePicUrl,
        fullName: contract.patron.user.fullName,
        username: contract.patron.user.username,
        userType: contract.patron.user.userType,
      },
      player: {
        id: contract.player.user.id,
        profilePicUrl: contract.player.user.profilePicUrl,
        fullName: contract.player.user.fullName,
        username: contract.player.user.username,
        userType: contract.player.user.userType,

      },
    }));
  }

  async getContractsWithUser(user1Id: string, user2Id: string) {
    const contracts = await this.contractRepo.find({
      where: [{ player: { id: user1Id }, patron: { id: user2Id } }, { player: { id: user2Id }, patron: { id: user1Id } }],
      relations: ['milestones', 'patron', 'player', 'patron.user', 'player.user'],
    });

    if (!contracts || contracts.length === 0) {
      return [];
    }

    return contracts.map(contract => ({
      ...contract,
      patron: {
        id: contract.patron.user.id,
        profilePicUrl: contract.patron.user.profilePicUrl,
        fullName: contract.patron.user.fullName,
        username: contract.patron.user.username,
        userType: contract.patron.user.userType,
      },
      player: {
        id: contract.player.user.id,
        profilePicUrl: contract.player.user.profilePicUrl,
        fullName: contract.player.user.fullName,
        username: contract.player.user.username,
        userType: contract.player.user.userType,

      },
    }));
  }

  async getContractById(id: string) {
        const contracts = await this.contractRepo.find({
      where: { id },
      relations: ['milestones', 'patron', 'player', 'patron.user', 'player.user'],
    });

    if (!contracts || contracts.length === 0) {
      return [];
    }

    return contracts.map(contract => ({
      ...contract,
      patron: {
        id: contract.patron.user.id,
        profilePicUrl: contract.patron.user.profilePicUrl,
        fullName: contract.patron.user.fullName,
        username: contract.patron.user.username,
        userType: contract.patron.user.userType,
      },
      player: {
        id: contract.player.user.id,
        profilePicUrl: contract.player.user.profilePicUrl,
        fullName: contract.player.user.fullName,
        username: contract.player.user.username,
        userType: contract.player.user.userType,

      },
    }));
  }


  async acceptContract(id: string, userId: string) {
    const contract = await this.contractRepo.findOne({ where: { id }, relations: ['patron', 'player'] });

    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    console.log(contract.patron.id, userId);
    console.log(contract.player.id, userId);

    if (contract.player.id !== userId) {
      throw new UnauthorizedException('You are not authorized to accept this contract');
    }

    contract.status = ContractStatus.IN_PROGRESS;

    await this.contractRepo.save(contract);

    return await this.getContractById(id);
  }


async updateContract(id: string, updateContractDto: UpdateContractDto) {
  const contract = await this.contractRepo.findOne({
    where: { id },
    relations: ['patron', 'player', 'milestones'],
  });

  if (!contract) {
    throw new NotFoundException('Contract not found');
  }

  // Update simple fields
  Object.assign(contract, {
    ...updateContractDto,
    milestones: undefined, // prevent accidental overwrite
  });

  // If milestones are provided
  if (updateContractDto.milestones) {
    // Remove existing milestones if needed (optional logic)
    await this.milestoneRepo.delete({ contract: { id } });

    // Save new milestones with proper contract reference
    const newMilestones = updateContractDto.milestones.map(m => this.milestoneRepo.create({ ...m, contract }));
    await this.milestoneRepo.save(newMilestones);

    contract.milestones = newMilestones;
  }

  await this.contractRepo.save(contract);

  return await this.getContractById(id);
}

}