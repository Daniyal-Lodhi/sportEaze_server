import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RegisterMentorDto } from './dto/register-mentor.dto';
import { UpdateMentorDto } from './dto/update-mentor.dto';
import { UserService } from '../user.service';
import { UserType } from 'src/common/enums/user/user-type.enum';
import { BaseUserDto } from '../dto/base-user.dto';
import { Mentor } from './entities/mentor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Player } from '../player/entities/player.entity';
import { Endorsement } from 'src/common/entities/endorsement.entity';
import e from 'express';
import { EndorseDto } from './dto/endorse.dto';
import { formatToLocalDateTime } from 'src/common/utils/dayjs.helper';
import { NotificationsService } from 'src/modules/notifications/notifications.service';
import { NotificationType } from 'src/common/enums/notifications/notifications.enum';

@Injectable()
export class MentorService {
  constructor(
    @InjectRepository(Mentor) private readonly mentorRepository: Repository<Mentor>,
    @InjectRepository(Player) private readonly playerRepository: Repository<Player>,
    @InjectRepository(Endorsement) private readonly endorsementRepository: Repository<Endorsement>,
    private readonly userService: UserService,
    private readonly notificationsService: NotificationsService,
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
    
        const mentor = Object.assign(new Mentor(), { id, ...mentorDetails });
    
        await this.mentorRepository.save(mentor);
    
        return this.userService.getUser(id);
  }

  async getMentorById(id: string)
  {
        const mentor = await this.mentorRepository.findOne({ where: { id }, relations: ['user'] });
    
        if (!mentor) {
          throw new NotFoundException(`Mentor with ID ${id} not found.`);
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

    async endorsePlayer(mentorId: string, body: EndorseDto) {
      const mentor = await this.mentorRepository.findOne({ where: { id: mentorId }, relations: ['user'] });

    if(!mentor) {
      throw new UnauthorizedException("Only mentors can endorse players");
    }

    const player = await this.playerRepository.findOne({ where: { id: body.playerId }, relations: ['user'] });

    if(!player) {
      throw new UnauthorizedException("Only players can be endorsed");
    }


    const endorsement = this.endorsementRepository.create({
      player: player,
      mentor: mentor,
      rating: body.rating,
      review: body.review,
    });

    await this.endorsementRepository.save(endorsement);

    await this.endorsementRepository.save(endorsement);

    await this.notificationsService.create(mentorId, {type: NotificationType.ENDORSEMENT_RECEIVED, recipientUserId: player.id}, player.id);

    return {
      ...endorsement,
      player: {
        id: player.id,
        profilePicUrl: player.user.profilePicUrl,
        fullName: player.user.fullName,
        username: player.user.username,
      },
      mentor: {
        id: mentor.id,
        profilePicUrl: mentor.user.profilePicUrl,
        fullName: mentor.user.fullName,
        username: mentor.user.username,
      },
    };
  }
    async getEndorsements(mentorId: string) {

    const endorsements = await this.endorsementRepository.find({
      where: { mentor: { id: mentorId } }, relations: ['player', "player.user", 'mentor', "mentor.user"],
    });

    return endorsements.map(endorsement => ({
      ...endorsement,
      createdAt: formatToLocalDateTime(endorsement.createdAt),
      player: {
        id: endorsement.player.id,
        profilePicUrl: endorsement.player.user.profilePicUrl,
        fullName: endorsement.player.user.fullName,
        username: endorsement.player.user.username,
      },
      mentor: {
        id: endorsement.mentor.id,
        profilePicUrl: endorsement.mentor.user.profilePicUrl,
        fullName: endorsement.mentor.user.fullName,
        username: endorsement.mentor.user.username,
      },
    }));
  }


  async getPreferredMentors(id?: string) {
    const mentorIds = await this.mentorRepository.find();

    return Promise.all(
      mentorIds.map(async mentor => await this.userService.getUser(mentor.id))
    );
  }
}
