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

    const wallet = this.walletRepository.create({ total: 0, pending: 0 });
    await this.walletRepository.save(wallet);
    patron.wallet = wallet;

    await this.patronRepository.save(patron);

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
    
    patron.wallet.total = patronDetails.walletTotal ?? patron.wallet.total;
    patron.wallet.pending = patronDetails.walletPending ?? patron.wallet.pending;

    await this.walletRepository.save(patron.wallet);

    await this.patronRepository.save(patron);
  
    return this.userService.getUser(id);
  }
  
  async verifyPatron(adminId : string, patronId: string, verifyPatronDto: VerifyPatronDto): Promise<any> {
    const user = await this.userService.getUser(adminId);
    const patron = await this.getPatronById(patronId);

    if(user.userType == UserType.SUPERUSER) {
      throw new UnauthorizedException("Only Admins can verify patrons")
    }

    this.patronRepository.save({
      ...patron,
      verifyPatronDto
    });

    this.patronSocketHandler.emitPatronVerification(patronId, verifyPatronDto.status);
  }


  async getPatrons(adminId: string): Promise<any> {
    const user = await this.userService.getUser(adminId);
    
    console.log(user);

    if(user.userType != UserType.SUPERUSER) {
      throw new UnauthorizedException("Only Admins can view patron registrations")
    }

    return await this.patronRepository.find({ where: { status: Not(PatronAccountStatus.APPROVED) } });
  }
}
