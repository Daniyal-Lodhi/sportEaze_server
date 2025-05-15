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
import { EndorseDto } from './dto/endorse.dto';
import { formatToLocalDateTime } from 'src/common/utils/dayjs.helper';
import { NotificationsService } from 'src/modules/notifications/notifications.service';
import { NotificationType } from 'src/common/enums/notifications/notifications.enum';
import { shuffleArray } from 'src/common/utils/shuffle-array';

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
      order: { createdAt: 'DESC' },
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


async getPreferredMentors(id: string) {
  const user = await this.userService.getUser(id);
  let filteredMentors = [];

  const allMentors = await this.mentorRepository.find();
  console.log(`[getPreferredMentors] All mentors fetched: ${allMentors.length}`);

  // --- FAN ---
  if (user.userType === UserType.FAN) {
    const sports = user.sportInterests ?? [];

    if (sports.length > 0) {
      filteredMentors = allMentors.filter(m =>
        sports.includes(m.primarySport) ||
        m.sportInterests?.some(s => sports.includes(s))
      );
    }
  }

  // --- PLAYER ---
  else if (user.userType === UserType.PLAYER) {
    const primary = user.player.primarySport;
    const secondary = user.player.secondarySports ?? [];

    filteredMentors = allMentors.filter(m =>
      (m.primarySport && (m.primarySport === primary || secondary.includes(m.primarySport))) ||
      (m.sportInterests?.some(s => s === primary || secondary.includes(s)))
    );
  }

  // --- MENTOR ---
  else if (user.userType === UserType.MENTOR) {
    const primary = user.mentor.primarySport;
    const interests = user.mentor.sportInterests ?? [];

    filteredMentors = allMentors.filter(m =>
      m.id !== user.id && ( // optional: exclude self
        (m.primarySport && (m.primarySport === primary || interests.includes(m.primarySport))) ||
        (m.sportInterests?.some(s => s === primary || interests.includes(s)))
      )
    );
  }

  // --- PATRON ---
  else if (user.userType === UserType.PATRON) {
    const sports = user.patron.supportedSports ?? [];

    filteredMentors = allMentors.filter(m =>
      sports.includes(m.primarySport) ||
      m.sportInterests?.some(s => sports.includes(s))
    );
  }

  // Fallback if no matches
  if (filteredMentors.length === 0) {
    console.log(`[getPreferredMentors] No matches found, fallback to all mentors`);
    filteredMentors = allMentors;
  }

  const data = await Promise.all(
    filteredMentors.map(m => this.userService.getUser(m.id))
  );

  const dataToReturn =  data.slice(0, 10);

  return dataToReturn.sort((a, b) => {
    const enodrsementDiff = (b.mentorEndorsementsCount || 0) - (a.mentorEndorsementsCount || 0);

    if (enodrsementDiff !== 0) return enodrsementDiff;
  })
}

}