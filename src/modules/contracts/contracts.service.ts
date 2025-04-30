import { Injectable } from '@nestjs/common';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { Contract } from './entities/contract.entity';
import { ContractStatus } from 'src/common/enums/contracts/contracts.enum';
import { Milestone } from './entities/milestones.entity';

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
  
    const contract = this.contractRepo.create({
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
  
    return savedContract;
  }
  
  findAll() {
    return `This action returns all contracts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} contract`;
  }

  update(id: number, updateContractDto: UpdateContractDto) {
    return `This action updates a #${id} contract`;
  }

  remove(id: number) {
    return `This action removes a #${id} contract`;
  }
}
