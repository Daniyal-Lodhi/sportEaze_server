import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { RegisterMentorDto } from './dto/register-mentor.dto';
import { UpdateMentorDto } from './dto/update-mentor.dto';
import { UserService } from '../user.service';
import { UserType } from 'src/common/enums/user/user-type.enum';
import { BaseUserDto } from '../dto/base-user.dto';
import { Mentor } from './entities/mentor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class MentorService {
  constructor(
    @InjectRepository(Mentor) private readonly mentorRepository: Repository<Mentor>,
    private readonly userService: UserService
  ) {}
  
  async create(id: string, registerMentorDto: RegisterMentorDto) {
        const user = await this.userService.getUser(id);

        const conflictMessages = {
          [UserType.MENTOR]: 'User is already registered as a mentor.',
          [UserType.PLAYER]: 'User is a player and cannot be registered as a mentor.',
          [UserType.FAN]: 'User is a fan and cannot be registered as a mentor.',
          [UserType.PATRON]: 'User is a mentor and cannot be registered as a mentor.',
        };
        
        if (conflictMessages[user.userType]) {
          throw new ConflictException(conflictMessages[user.userType]);
        }
        
        const { profilePicUrl, fullName, username, dob, gender, ...mentorDetails } = registerMentorDto;
    
        const updateUerDto: BaseUserDto = {
          profilePicUrl,
          fullName,
          username,
          dob,
          gender,
        }
    
        await this.userService.updateUser(id, updateUerDto, UserType.MENTOR);
    
        const patron = Object.assign(new Mentor(), { id, ...mentorDetails });
    
        await this.mentorRepository.save(patron);
    
        return this.userService.getUser(id);
  }

  async getMentorById(id: string)
  {
        const mentor = await this.mentorRepository.findOne({ where: { id }, relations: ['user'] });
    
        if (!mentor) {
          throw new NotFoundException(`Patron with ID ${id} not found.`);
        }
    
        return mentor;
    
  }

  async update(id: string, updateMentorDto: UpdateMentorDto) {
    await this.userService.getUser(id);
        const mentor = await this.getMentorById(id);
      
        const { profilePicUrl, fullName, dob, gender, ...mentorDetails } = updateMentorDto;
        
        const updateUserDto: UpdateUserDto = { profilePicUrl, fullName, dob, gender };
      
        await this.userService.updateUser(id, updateUserDto, UserType.MENTOR);
      
        Object.assign(mentor, { id, ...mentorDetails });
      
        await this.mentorRepository.save(mentor);
      
        return this.userService.getUser(id);
  }

}
