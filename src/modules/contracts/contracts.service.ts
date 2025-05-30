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
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from 'src/common/enums/notifications/notifications.enum';
import { start } from 'repl';
import { formatToLocalDateTime } from 'src/common/utils/dayjs.helper';
import { Wallet } from 'src/common/entities/wallet.entity';
import { ReleaseFundsDto } from './dto/release-funds.dto';
import { socketClients } from '../socket/socket.gateway';
import { WALLET_UPDATED } from 'src/common/consts/socket-events';

@Injectable()
export class ContractsService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>, 
    @InjectRepository(Contract)
    private contractRepo: Repository<Contract>,
    @InjectRepository(Milestone)
    private milestoneRepo: Repository<Milestone>,
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    private readonly notificationService: NotificationsService,

  ) {}
  
  async create(patronId: string, createContractDto: CreateContractDto) {
    const patron = await this.userRepo.findOne({ where: { id: patronId }, relations: ['patron', "patron.wallet"] });
    const player = await this.userRepo.findOne({ where: { id: createContractDto.playerId }, relations: ["player", 'player.wallet'] });
  
    if (!patron || !player) {
      throw new NotFoundException('Patron or Player not found');
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

    await this.notificationService.create(patronId, {type: NotificationType.CONTRACT_CREATED, recipientUserId: player.id}, contract.id);

    const wallet = await this.walletRepository.findOne({ where: { patron: { id: patronId } } });

    console.log(wallet) 

    wallet.payables += contract.totalAmount;

    await this.walletRepository.save(wallet);
    
    const patronSocket = socketClients.get(patronId);

    if(patronSocket) {
      patronSocket.emit(WALLET_UPDATED, wallet);
    }


    return {
      ...contract,
      startDate: formatToLocalDateTime(contract.startDate),
      endDate: formatToLocalDateTime(contract.endDate),
      milestones: contract.milestones.map(milestone => ({
        id: milestone.id,
        description: milestone.description,
        amount: milestone.amount,
        contractId: contract.id,
        isAchieved: milestone.isAchieved,
        isPaid: milestone.isPaid,
      })),
      patron: {
        id: contract.patron.user.id,
        profilePicUrl: contract.patron.user.profilePicUrl,
        fullName: contract.patron.user.fullName,
        username: contract.patron.user.username,
        userType: contract.patron.user.userType,
        wallet,
      },
      player: {
        id: contract.player.user.id,
        profilePicUrl: contract.player.user.profilePicUrl,
        fullName: contract.player.user.fullName,
        username: contract.player.user.username,
        userType: contract.player.user.userType,
        wallet: player.player.wallet,
      },
    }
  }
  
  async getContractsByUserId(id: string, filter: number) {
    let contracts;

    if (filter === 0) {
      contracts = await this.contractRepo.find({
        where: [{ player: { id }}, { patron: { id } }],
        relations: ['milestones', 'patron', 'player', "patron.wallet", "player.wallet", 'patron.user', 'player.user'],
        order: { startDate: 'DESC' },
      });
    } else {
      contracts = await this.contractRepo.find({
        where: [{ player: { id }, status: filter }, { patron: { id }, status: filter }],
        relations: ['milestones', 'patron', 'player', "patron.wallet", "player.wallet", 'patron.user', 'player.user'],
        order: { startDate: 'DESC' },
      });
    }

    if (!contracts || contracts.length === 0) {
      return [];
    }

    return contracts.map(contract => ({
      ...contract,
      startDate: formatToLocalDateTime(contract.startDate),
      endDate: formatToLocalDateTime(contract.endDate),
      milestones: contract.milestones.map(milestone => ({
        id: milestone.id,
        description: milestone.description,
        amount: milestone.amount,
        contractId: contract.id,
        isAchieved: milestone.isAchieved,
        isPaid: milestone.isPaid,
      })),
      patron: {
        id: contract.patron.user.id,
        profilePicUrl: contract.patron.user.profilePicUrl,
        fullName: contract.patron.user.fullName,
        username: contract.patron.user.username,
        userType: contract.patron.user.userType,
        wallet: contract.patron.wallet,
      },
      player: {
        id: contract.player.user.id,
        profilePicUrl: contract.player.user.profilePicUrl,
        fullName: contract.player.user.fullName,
        username: contract.player.user.username,
        userType: contract.player.user.userType,
        wallet: contract.player.wallet,
      },
    }));
  }

  async getContractsWithUser(user1Id: string, user2Id: string) {
    const contracts = await this.contractRepo.find({
      where: [{ player: { id: user1Id }, patron: { id: user2Id } }, { player: { id: user2Id }, patron: { id: user1Id } }],
        relations: ['milestones', 'patron', 'player', "patron.wallet", "player.wallet", 'patron.user', 'player.user'],
      order: { startDate: 'DESC' },
    });

    if (!contracts || contracts.length === 0) {
      return [];
    }

    return contracts.map(contract => ({
      ...contract,
      startDate: formatToLocalDateTime(contract.startDate),
      endDate: formatToLocalDateTime(contract.endDate),
      milestones: contract.milestones.map(milestone => ({
        id: milestone.id,
        description: milestone.description,
        amount: milestone.amount,
        contractId: contract.id,
        isAchieved: milestone.isAchieved,
        isPaid: milestone.isPaid,
      })),
      patron: {
        id: contract.patron.user.id,
        profilePicUrl: contract.patron.user.profilePicUrl,
        fullName: contract.patron.user.fullName,
        username: contract.patron.user.username,
        userType: contract.patron.user.userType,
        wallet: contract.patron.wallet,
      },
      player: {
        id: contract.player.user.id,
        profilePicUrl: contract.player.user.profilePicUrl,
        fullName: contract.player.user.fullName,
        username: contract.player.user.username,
        userType: contract.player.user.userType,
        wallet: contract.player.wallet,
      },
    }));
  }

  async getContractById(id: string) {
        const contract = await this.contractRepo.findOne({
      where: { id },
      relations: ['milestones', 'patron', 'player', 'patron.user', 'player.user'],
      order: { startDate: 'DESC' },
    });

    if (!contract) {
      return {};
    }

    return {
      ...contract,
      startDate: formatToLocalDateTime(contract.startDate),
      endDate: formatToLocalDateTime(contract.endDate),
      milestones: contract.milestones.map(milestone => ({
        id: milestone.id,
        description: milestone.description,
        amount: milestone.amount,
        contractId: contract.id,
        isAchieved: milestone.isAchieved,
        isPaid: milestone.isPaid,
      })),
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
    };
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

    this.notificationService.create(userId, {type: NotificationType.CONTRACT_ACCEPTED, recipientUserId: contract.patron.id}, contract.id);

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
      milestones: undefined
    });

    const milestones = await this.milestoneRepo.find({where: {contract: {id}}, relations: ['contract']});

if (contract.totalAmount !== updateContractDto.totalAmount) {
  const amountDifference = updateContractDto.totalAmount - contract.totalAmount;

  const patronWallet = await this.walletRepository.findOne({ where: { patron: { id: contract.patron.id } } });

  if (!patronWallet) {
    throw new NotFoundException('Patron wallet not found');
  }

  if (amountDifference > 0) {
    // Total amount increased: ensure patron has enough funds
    if (patronWallet.cash < amountDifference) {
      throw new UnauthorizedException('Insufficient funds');
    }

    patronWallet.payables += amountDifference;
  } else {
    // Total amount decreased: adjust payables downward
    const absoluteDiff = Math.abs(amountDifference);
    patronWallet.payables = Math.max(0, patronWallet.payables - absoluteDiff); // avoid negative payables
  }

  await this.walletRepository.save(patronWallet);

  const patronSocket = socketClients.get(contract.patron.id);
  if (patronSocket) {
    patronSocket.emit(WALLET_UPDATED, patronWallet);
  }
}

    Object.assign(milestones, updateContractDto.milestones);

    await this.milestoneRepo.save(milestones);

    await this.contractRepo.save(contract);

    this.notificationService.create(contract.patron.id, {type: NotificationType.CONTRACT_UPDATED, recipientUserId: contract.player.id}, contract.id);

    return await this.getContractById(id);
  }


  async releaseFunds(userId: string, { playerId, milestoneId }: ReleaseFundsDto) {
    const milestone = await this.milestoneRepo.findOne({ where: { id: milestoneId }, relations: ["contract"] });

    
    if(!milestone) {
      throw new NotFoundException('Milestone not found');
    }
    
    if(milestone.isPaid)
      throw new UnauthorizedException('Milestone already paid');
    
    const patronWallet = await this.walletRepository.findOne({ where: { patron: { id: userId } } });
    
    if(patronWallet.cash < milestone.amount) {
      throw new UnauthorizedException('Insufficient funds');
    }

    milestone.isPaid = true;
    milestone.isAchieved = true;

    patronWallet.cash -= milestone.amount;
    patronWallet.payables -= milestone.amount;

    const playerWallet = await this.walletRepository.findOne({ where: { player: { id: playerId } } });
    console.log(playerWallet);
    playerWallet.cash += milestone.amount;

    await this.milestoneRepo.save(milestone);

    await this.walletRepository.save(patronWallet);
    await this.walletRepository.save(playerWallet);

    const patronSocket = socketClients.get(userId);

    if(patronSocket) {
      patronSocket.emit(WALLET_UPDATED, patronWallet);
    }

    const playerSocket = socketClients.get(playerId);

    if(playerSocket) {
      playerSocket.emit(WALLET_UPDATED, playerWallet);
    }


    await this.notificationService.create(playerId, {type: NotificationType.FUNDS_RELEASED, recipientUserId: userId}, milestone.contract.id);
    await this.notificationService.create(userId, {type: NotificationType.FUNDS_RECEIVED, recipientUserId: playerId}, milestone.contract.id);
  }
}