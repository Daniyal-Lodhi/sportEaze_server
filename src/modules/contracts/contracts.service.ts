import { Injectable } from '@nestjs/common';
import { CreateContractDto } from './dto/create-contract.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Contract } from './entities/contract.entity';
import { Milestone } from './entities/milestones.entity';
import { ContractStatus } from 'src/common/enums/contracts/contracts.enum';

@Injectable()
export class ContractsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    
    @InjectRepository(Contract)
    private readonly contractRepo: Repository<Contract>,
    
    @InjectRepository(Milestone)
    private readonly milestoneRepo: Repository<Milestone>,
  ) {}

  private formatUserProfile(user: User) {
    return {
      id: user.id,
      profilePicUrl: user.profilePicUrl,
      fullName: user.fullName,
      username: user.username,
      userType: user.userType,
    };
  }

  private formatContract(contract: Contract) {
    return {
      ...contract,
      patron: this.formatUserProfile(contract.patron.user),
      player: this.formatUserProfile(contract.player.user),
    };
  }

  async create(patronId: string, dto: CreateContractDto) {
    const [patron, player] = await Promise.all([
      this.userRepo.findOne({ where: { id: patronId } }),
      this.userRepo.findOne({ where: { id: dto.playerId } }),
    ]);

    if (!patron || !player) {
      throw new Error('Patron or Player not found');
    }

    const milestones = dto.milestones.map(m => this.milestoneRepo.create(m));

    const contract = this.contractRepo.create({
      ...dto,
      status: ContractStatus.PENDING,
      patron,
      player,
      milestones,
    });

    const savedContract = await this.contractRepo.save(contract);

    await Promise.all(
      milestones.map(m => {
        m.contract = savedContract;
        return this.milestoneRepo.save(m);
      }),
    );

    const completeContract = await this.contractRepo.findOne({
      where: { id: savedContract.id },
      relations: ['milestones', 'patron', 'player', 'patron.user', 'player.user'],
    });

    return this.formatContract(completeContract);
  }

  async getContractsByUserId(id: string) {
    const contracts = await this.contractRepo.find({
      where: [{ player: { id } }, { patron: { id } }],
      relations: ['milestones', 'patron', 'player', 'patron.user', 'player.user'],
    });

    return contracts.map(this.formatContract.bind(this));
  }

  async getContractsWithUser(user1Id: string, user2Id: string) {
    const contracts = await this.contractRepo.find({
      where: [
        { player: { id: user1Id }, patron: { id: user2Id } },
        { player: { id: user2Id }, patron: { id: user1Id } },
      ],
      relations: ['milestones', 'patron', 'player', 'patron.user', 'player.user'],
    });

    return contracts.map(this.formatContract.bind(this));
  }
}
