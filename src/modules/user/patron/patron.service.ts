import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Patron } from './entities/patron.entity';
import { Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '../user.service';
import { UserType } from 'src/common/enums/user/user-type.enum';
import { RegisterPatronDto } from './dto/register-patron.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UpdatePatronDto } from './dto/update-patron.dto';
import { BaseUserDto } from '../dto/base-user.dto';
import { VerifyPatronDto } from './dto/verify-patron.dto';
import { GetUserDto } from '../dto/get-user.dto';
import { PatronAccountStatus } from 'src/common/enums/patron/patron.enum';
import { PatronSocketHandler } from './patron.socket.handler';
import { Wallet } from 'src/common/entities/wallet.entity';
import { shuffleArray } from 'src/common/utils/shuffle-array';

@Injectable()
export class PatronService {
  constructor(
    @InjectRepository(Patron) private readonly patronRepository: Repository<Patron>,
    @InjectRepository(Wallet) private readonly walletRepository: Repository<Wallet>,
    private readonly userService: UserService,
    private readonly patronSocketHandler: PatronSocketHandler,    
  ) {}
  

  async create(id: string, registerPatronDto: RegisterPatronDto): Promise<GetUserDto> {
    const user = await this.userService.getUser(id);
    const conflictMessages = {
      [UserType.PATRON]: 'User is already registered as a patron.',
      [UserType.PLAYER]: 'User is a player and cannot be registered as a patron.',
      [UserType.FAN]: 'User is a fan and cannot be registered as a patron.',
      [UserType.MENTOR]: 'User is a mentor and cannot be registered as a patron.',
    };
    
    if (conflictMessages[user.userType]) {
      throw new ConflictException(conflictMessages[user.userType]);
    }
    
    const { profilePicUrl, fullName, username, dob, gender, ...patronDetails } = registerPatronDto;

    const updateUerDto: BaseUserDto = {
      profilePicUrl,
      fullName,
      username,
      dob,
      gender,
    }

    await this.userService.updateUser(id, updateUerDto, UserType.PATRON);

    const patron = Object.assign(new Patron(), { id, ...patronDetails });

    const wallet = this.walletRepository.create({ cash: 10000, payables: 0, patron });

    console.log(wallet);

    patron.wallet = wallet;
    
    await this.patronRepository.save(patron);
    await this.walletRepository.save(wallet);

    return this.userService.getUser(id);
  }

  async getPatronById(id: string): Promise<Patron> {
    const patron = await this.patronRepository.findOne({ where: { id }, relations: ['user', "wallet"] });

    if (!patron) {
      throw new NotFoundException(`Patron with ID ${id} not found.`);
    }

    return patron;
  }

  async update(id: string, updatePatronDto: UpdatePatronDto): Promise<GetUserDto> {
    
    await this.userService.getUser(id);
    const patron = await this.getPatronById(id);
  
    const { profilePicUrl, fullName, dob, gender, ...patronDetails } = updatePatronDto;
    
    // Update user details
    const updateUserDto: UpdateUserDto = { profilePicUrl, fullName, dob, gender };
  
    await this.userService.updateUser(id, updateUserDto, UserType.PATRON);
  
    // Update patron details
    Object.assign(patron, { id, ...patronDetails });
    
    patron.wallet.cash = patronDetails.walletTotal ?? patron.wallet.cash;
    patron.wallet.payables = patronDetails.walletPending ?? patron.wallet.payables;

    await this.walletRepository.save(patron.wallet);

    await this.patronRepository.save(patron);
  
    return this.userService.getUser(id);
  }
  
  async verifyPatron(adminId : string, patronId: string, verifyPatronDto: VerifyPatronDto): Promise<any> {
    const user = await this.userService.getUser(adminId);
    const patron = await this.getPatronById(patronId);

    if(user.userType != UserType.SUPERUSER) {
      throw new UnauthorizedException("Only Admins can verify patrons")
    }

    await this.patronRepository.save({
      ...patron,
      ...verifyPatronDto
    });

    this.patronSocketHandler.emitPatronVerification(patronId, verifyPatronDto.status);

    const updatedPatron = await this.userService.getUser(patronId);

    return {
      message: "Patron verified successfully",
      user: updatedPatron,
    };
  }


  async getPatrons(adminId: string): Promise<any> {
    const user = await this.userService.getUser(adminId);
    
    // console.log(user);

    if(user.userType != UserType.SUPERUSER) {
      throw new UnauthorizedException("Only Admins can view patron registrations")
    }

    const patronIds = await this.patronRepository.find({ where: { status: Not(PatronAccountStatus.APPROVED) }, select: ['id'] });

    // console.log(patronIds);

    let patrons = [];

    for (const element of patronIds) {
      const user = await this.userService.getUser(element.id);
      patrons.push(user);
    }

    return patrons;

  }

async getPreferredPatrons(id: string) {
  const user = await this.userService.getUser(id);
  let patronIds = [];

  const qb = this.patronRepository.createQueryBuilder('patron');

  // --- FAN ---
  if (user.userType === UserType.FAN) {
    const sports = user.sportInterests ?? [];

    if (sports.length > 0) {
      qb.where('patron.supportedSports && :sports', { sports });
    }
  }

  // --- PLAYER ---
  else if (user.userType === UserType.PLAYER) {
    const sports = [user.player.primarySport, ...(user.player.secondarySports ?? [])].filter(Boolean);
    const level = user.player.playingLevel;

    if (sports.length > 0) {
      qb.where('patron.supportedSports && :sports', { sports });
    }

    if (level) {
      if (qb.expressionMap.wheres.length > 0) {
        qb.orWhere(':level = ANY(patron.preferredPlayerLevels)', { level });
      } else {
        qb.where(':level = ANY(patron.preferredPlayerLevels)', { level });
      }
    }
  }

  // --- MENTOR ---
  else if (user.userType === UserType.MENTOR) {
    const sports = [user.mentor.primarySport, ...(user.mentor.sportInterests ?? [])].filter(Boolean);

    if (sports.length > 0) {
      qb.where('patron.supportedSports && :sports', { sports });
    }
  }

  // --- PATRON (match other patrons) ---
  else if (user.userType === UserType.PATRON) {
    const sports = user.patron.supportedSports ?? [];

    if (sports.length > 0) {
      qb.where('patron.supportedSports && :sports', { sports });
    }
  }

  qb.select('patron.id');
  patronIds = await qb.getMany();

  // Fallback to all patrons if none matched
  if (patronIds.length === 0) {
    patronIds = await this.patronRepository
      .createQueryBuilder('patron')
      .select('patron.id')
      .getMany();
  }

  if(patronIds.length === 0) {
    patronIds = await this.patronRepository.find();
  }

  const data = await Promise.all(
    patronIds.map((patron) => this.userService.getUser(patron.id))
  );

  return shuffleArray(data).slice(0,10);
}

}
