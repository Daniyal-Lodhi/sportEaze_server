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
  let mentorIds = [];

  const qb = this.mentorRepository.createQueryBuilder('mentor');

  // --- FAN ---
  if (user.userType === UserType.FAN) {
    const sports = user.sportInterests ?? [];

    if (sports.length > 0) {
      // Try primarySport match
      const primaryMatch = await this.mentorRepository
        .createQueryBuilder('mentor')
        .where('mentor.primarySport IN (:...sports)', { sports })
        .select('mentor.id')
        .getMany();

      if (primaryMatch.length > 0) {
        mentorIds = primaryMatch;
      } else {
        // Try sportInterests match
        const interestMatch = await this.mentorRepository
          .createQueryBuilder('mentor')
          .where('mentor.sportInterests && :sports', { sports })
          .select('mentor.id')
          .getMany();

        mentorIds = interestMatch;
      }
    }
  }

  // --- PLAYER ---
  else if (user.userType === UserType.PLAYER) {
    const primary = user.player.primarySport;
    const secondary = user.player.secondarySports ?? [];

    const conditions: any[] = [];

    if (primary) {
      // 1. primary ↔ primary
      conditions.push(
        this.mentorRepository
          .createQueryBuilder('mentor')
          .where('mentor.primarySport = :primary', { primary })
          .select('mentor.id')
          .getMany()
      );
    }

    if (secondary.length > 0) {
      // 2. secondary ↔ primary
      conditions.push(
        this.mentorRepository
          .createQueryBuilder('mentor')
          .where('mentor.primarySport IN (:...secondary)', { secondary })
          .select('mentor.id')
          .getMany()
      );
    }

    if (primary) {
      // 3. primary ↔ sportInterests
      conditions.push(
        this.mentorRepository
          .createQueryBuilder('mentor')
          .where('mentor.sportInterests && :primaryArray', { primaryArray: [primary] })
          .select('mentor.id')
          .getMany()
      );
    }

    if (secondary.length > 0) {
      // 4. secondary ↔ sportInterests
      conditions.push(
        this.mentorRepository
          .createQueryBuilder('mentor')
          .where('mentor.sportInterests && :secondary', { secondary })
          .select('mentor.id')
          .getMany()
      );
    }

    const allMatches = await Promise.all(conditions);
    mentorIds = Array.from(new Map(allMatches.flat().map(p => [p.id, p])).values());
  }

  // --- MENTOR ---
  else if (user.userType === UserType.MENTOR) {
    const primary = user.mentor.primarySport;
    const interests = user.mentor.sportInterests ?? [];

    const conditions: any[] = [];

    if (primary) {
      // 1. primary ↔ primary
      conditions.push(
        this.mentorRepository
          .createQueryBuilder('mentor')
          .where('mentor.primarySport = :primary', { primary })
          .select('mentor.id')
          .getMany()
      );
    }

    if (interests.length > 0) {
      // 2. interest[] ↔ primary
      conditions.push(
        this.mentorRepository
          .createQueryBuilder('mentor')
          .where('mentor.primarySport IN (:...interests)', { interests })
          .select('mentor.id')
          .getMany()
      );
    }

    if (primary) {
      // 3. primary ↔ sportInterests
      conditions.push(
        this.mentorRepository
          .createQueryBuilder('mentor')
          .where('mentor.sportInterests && :primaryArray', { primaryArray: [primary] })
          .select('mentor.id')
          .getMany()
      );
    }

    if (interests.length > 0) {
      // 4. interest[] ↔ sportInterests
      conditions.push(
        this.mentorRepository
          .createQueryBuilder('mentor')
          .where('mentor.sportInterests && :interests', { interests })
          .select('mentor.id')
          .getMany()
      );
    }

    const allMatches = await Promise.all(conditions);
    mentorIds = Array.from(new Map(allMatches.flat().map(p => [p.id, p])).values());

    if (mentorIds.length === 0) {
      mentorIds = await this.mentorRepository
        .createQueryBuilder('mentor')
        .select('mentor.id')
        .getMany();
    }
  }

  // --- PATRON ---
  else if (user.userType === UserType.PATRON) {
    const sports = user.patron.supportedSports ?? [];

    if (sports.length > 0) {
      qb.where('mentor.primarySport IN (:...sports)', { sports })
        .orWhere('mentor.sportInterests && :sports', { sports });
    }

    qb.select('mentor.id');
    mentorIds = await qb.getMany();

    if (mentorIds.length === 0) {
      mentorIds = await this.mentorRepository
        .createQueryBuilder('mentor')
        .select('mentor.id')
        .getMany();
    }
  }

  if(mentorIds.length === 0) {
    mentorIds = await this.mentorRepository
      .createQueryBuilder('mentor')
      .select('mentor.id')
      .getMany();
  }

  // Final result
  const data = await Promise.all(
    mentorIds.map((mentor) => this.userService.getUser(mentor.id))
  );

  return data;
}

}