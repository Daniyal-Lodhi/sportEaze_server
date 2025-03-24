import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Patron } from './entities/patron.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '../user.service';
import { UserType } from 'src/common/enums/user/user-type.enum';
import { RegisterPatronDto } from './dto/register-patron.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UpdatePatronDto } from './dto/update-patron.dto';
import { BaseUserDto } from '../dto/base-user.dto';

@Injectable()
export class PatronService {
  constructor(
    @InjectRepository(Patron) private readonly patronRepository: Repository<Patron>,
    private readonly userService: UserService,            
  ) {}
  

  async create(id: string, registerPatronDto: RegisterPatronDto): Promise<Patron> {
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

    await this.patronRepository.save(patron);

    return this.getPatronById(id);
  }

  async getPatronById(id: string): Promise<Patron> {
    const patron = await this.patronRepository.findOne({ where: { id }, relations: ['user'] });

    if (!patron) {
      throw new NotFoundException(`Patron with ID ${id} not found.`);
    }

    return patron;
  }

  async update(id: string, updatePatronDto: UpdatePatronDto): Promise<Patron> {
    
    await this.userService.getUser(id);
    const patron = await this.getPatronById(id);
  
    const { profilePicUrl, fullName, dob, gender, ...patronDetails } = updatePatronDto;
    
    // Update user details
    const updateUserDto: UpdateUserDto = { profilePicUrl, fullName, dob, gender };
  
    await this.userService.updateUser(id, updateUserDto, UserType.PATRON);
  
    // Update patron details
    Object.assign(patron, { id, ...patronDetails });
  
    await this.patronRepository.save(patron);
  
    return this.getPatronById(id);
  }
  
}
