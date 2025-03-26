import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { UpdatePlayerDto } from "./dto/update-player.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../../user/entities/user.entity";
import { Player } from "./entities/player.entity";
import { UserType } from "src/common/enums/user/user-type.enum";
import { UserService } from "../../user/user.service";
import { GetPlayerDto } from "./dto/get-player.dto";
import { RegisterPlayerDto } from "./dto/register-player.dto";
import { BaseUserDto } from "../dto/base-user.dto";
import { GetUserDto } from "../dto/get-user.dto";

@Injectable()
export class PlayerService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
  ) {}

  async RegisterPlayer(id: string, registerPlayerDto: RegisterPlayerDto): Promise<GetUserDto> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user || user.deleted) {
        throw new NotFoundException(`User not found`);
    }

    if (user.userType !== UserType.FAN && user.userType !== null) {
        throw new ConflictException(
            `Since this account is registered as ${UserType[user.userType]}, you cannot change it to a player`,
        );
    }

    const { profilePicUrl, fullName, username, dob, gender, ...playerDetails } = registerPlayerDto;
    
    const updateUserDto: BaseUserDto = { profilePicUrl, fullName, username, dob, gender };
    
    await this.userService.updateUser(id, updateUserDto, UserType.PLAYER);

    const player = Object.assign(new Player(), { id, ...playerDetails });

    await this.playerRepository.save(player);

    return this.userService.getUser(id);
  }

  async getPlayer(id: string): Promise<GetPlayerDto> {
    const player = await this.playerRepository.findOne({
      where: { id },
      relations: ["user"],
    });

    if (!player) {
      throw new NotFoundException(`Player with ID ${id} not found`);
    }

    if (player.user.deleted) {
      throw new NotFoundException("User not found");
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

  async updatePlayer(
    id: string,
    updatePlayerDto: UpdatePlayerDto,
  ): Promise<GetUserDto> {
    const player = await this.playerRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  
    if (!player) {
      throw new NotFoundException(`Player with ID ${id} not found`);
    }
  
    if (player.user) {
      Object.assign(player.user, {
        profilePicUrl: updatePlayerDto.profilePicUrl ?? player.user.profilePicUrl,
        fullName: updatePlayerDto.fullName ?? player.user.fullName,
        dob: updatePlayerDto.dob ?? player.user.dob,
        gender: updatePlayerDto.gender ?? player.user.gender,
      });

      await this.userRepository.save(player.user);
    }
  
    const playerUpdates = { ...updatePlayerDto };
    delete playerUpdates.profilePicUrl;
    delete playerUpdates.fullName;
    delete playerUpdates.dob;
    delete playerUpdates.gender;
  
    Object.assign(player, playerUpdates);
    await this.playerRepository.save(player);
  
    return this.userService.getUser(id);
  }
}
