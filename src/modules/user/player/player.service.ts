import { BadRequestException, ConflictException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Player } from './entities/player.entity';
import { UserType } from 'src/common/enums/user-type.enum';
import { UserService } from '../../user/user.service';
import { GetUserDto } from '../../user/dto/get-user.dto';
import { GetPlayerDto } from './dto/get-player.dto';
import { AddSocialMediaLinkDto } from './dto/add-social-media-link.dto';
import { DeleteSocialMediaDto } from './dto/delete-socia-media-links.dto';
import { HandleDeleteSocialMediaLink } from 'src/common/utils/player-utils';

@Injectable()
export class PlayerService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(User) private readonly userrRepository: Repository<User>,
    @InjectRepository(Player) private readonly playerRepository: Repository<Player>,
  ) { }

  async ChangeUserTypeToPlayer(id: string): Promise<GetUserDto> {
    const user = await this.userrRepository.findOne({ where: { id } });
  
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  
    if (user.userType !== UserType.FAN) {
      throw new ConflictException(
        `Since this account is registered as ${user.userType}, you cannot change it to a player`
      );
    }
  
    user.userType = UserType.PLAYER;
    await this.userrRepository.save(user);
  
    return await this.create(id);
  }
  
  async create(id: string): Promise<GetUserDto> {
    const existingPlayer = await this.playerRepository.findOne({ where: { id } });
  
    if (existingPlayer) {
      throw new ConflictException("This user is already a player");
    }
  
    const player = new Player();
    player.id = id;
  
    const createdPlayer = await this.playerRepository.save(player);
  
    return await this.userService.getUser(id);
  }
  
  async getPlayer(id: string): Promise<GetPlayerDto> {
    const player = await this.playerRepository.findOne({
      where: { id },
      relations: [
        "achievements",
        "contracts",
        "preferredSport",
        "user",
      ],
    });
  
    if (!player) {
      throw new NotFoundException(`Player with ID ${id} not found`);
    }

    if(player.user.deleted){
      throw new NotFoundException("User not found")
    }

    const sanitizedPlayer: GetPlayerDto = {
      ...player,
      id: undefined,
      user: {
        ...player.user,
        password: undefined,
      },
    };
  
    return sanitizedPlayer;
  }

  async updatePlayer(id: string, updatePlayerDto: UpdatePlayerDto): Promise<GetPlayerDto>
  {
    await this.userService.getUser(id);
    
    const player = await this.playerRepository.findOne({
      where: { id },
      relations: [
        "achievements",
        "contracts",
        "preferredSport",
      ],
    });
    
    if (!player) {
      throw new NotFoundException(`Player with ID ${id} not found`);
    }
    

    Object.assign(player, updatePlayerDto);

    const updatedPlayer = await this.playerRepository.save(player);

    console.log(updatedPlayer);

    const sanitizedPlayer: GetPlayerDto = {
      ...updatedPlayer,
      id: undefined,
    };
  
    return sanitizedPlayer;
  }

  async addPlayerLink(id: string, addSocialMediaLinkDto: AddSocialMediaLinkDto): Promise<GetPlayerDto> {
    await this.userService.getUser(id);

    const player = await this.playerRepository.findOne({ where: { id } });

    if(!player)
    {
      throw new NotFoundException("This user is not a player");
    }

    Object.assign(player, addSocialMediaLinkDto);

    console.log(player);
    
    const updatedPlayer: GetPlayerDto = await this.playerRepository.save(player);
    console.log(updatedPlayer);

    const sanitizedPlayer: GetPlayerDto = {
      ...updatedPlayer,
      id: undefined,
    };
  
    return sanitizedPlayer;
  }
  
  async deletePlayerLink(id: string, deleteSocialMediaLinkDto: DeleteSocialMediaDto): Promise<string> {
    await this.userService.getUser(id);

    const player = await this.playerRepository.findOne({ where: { id } });    

    if(!player)
    {
      throw new NotFoundException("This user is not a player");
    }

    const response = HandleDeleteSocialMediaLink(deleteSocialMediaLinkDto, player);
    
    console.log(player);
    
    const updatedPlayer: GetPlayerDto = await this.playerRepository.save(player);
    console.log(updatedPlayer);

    if(updatedPlayer)
    {
      return response;
    }
    else return "Cannot Save player after deleting";
  }

  async getPlayerLink(id: string): Promise<AddSocialMediaLinkDto> {
    await this.userService.getUser(id);

    const player = await this.getPlayer(id);

    if(!player)
    {
      throw new NotFoundException("This user is not a player");
    }


    return {
      FB_link: player.FB_link,
      INSTA_link: player.INSTA_link,
      X_link: player.X_link,
    };
  }

}
