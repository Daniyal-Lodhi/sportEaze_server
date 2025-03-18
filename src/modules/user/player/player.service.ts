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
import { UserType } from "src/common/enums/user-type.enum";
import { UserService } from "../../user/user.service";
import { GetUserDto } from "../../user/dto/get-user.dto";
import { GetPlayerDto } from "./dto/get-player.dto";
import { AddSocialMediaLinkDto } from "./dto/add-social-media-link.dto";
import { DeleteSocialMediaDto } from "./dto/delete-socia-media-links.dto";
import { HandleDeleteSocialMediaLink } from "src/common/utils/player-utils";
import { RegisterPlayerDto } from "./dto/register-player.dto";

@Injectable()
export class PlayerService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
  ) {}

  async RegisterPlayer(id: string, registerPlayerDto: RegisterPlayerDto): Promise<GetPlayerDto> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user || user.deleted) {
        throw new NotFoundException(`User not found`);
    }

    if (user.userType !== UserType.FAN) {
        throw new ConflictException(
            `Since this account is registered as ${UserType[user.userType]}, you cannot change it to a player`,
        );
    }

    const { profilePicUrl, fullName, username, dob, gender, ...playerDetails } = registerPlayerDto;

    await this.userRepository.save({
        ...user,
        userType: UserType.PLAYER,
        profilePicUrl,
        fullName,
        username,
        dob,
        gender
    });

    const player = Object.assign(new Player(), { id, ...playerDetails });

    await this.playerRepository.save(player);

    return this.getPlayer(id);
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
  ): Promise<GetPlayerDto> {
    await this.userService.getUser(id);

    const player = await this.playerRepository.findOne({
      where: { id },
    });

    if (!player) {
      throw new NotFoundException(`Player with ID ${id} not found`);
    }


    const { profilePicUrl, fullName, dob, gender, ...playerDetails } = updatePlayerDto;

    const user = {
      profilePicUrl,
      fullName,
      dob,
      gender
    };

    await this.userRepository.save({
      ...user
    });

    Object.assign(player, updatePlayerDto);

    const updatedPlayer = await this.playerRepository.save(player);

    console.log(updatedPlayer);

    const sanitizedPlayer: GetPlayerDto = {
      ...updatedPlayer,
      id: undefined,
    };

    return sanitizedPlayer;
  }

  async addPlayerLink(
    id: string,
    addSocialMediaLinkDto: AddSocialMediaLinkDto,
  ): Promise<GetPlayerDto> {
    await this.userService.getUser(id);

    const player = await this.playerRepository.findOne({ where: { id } });

    if (!player) {
      throw new NotFoundException("This user is not a player");
    }

    Object.assign(player, addSocialMediaLinkDto);

    console.log(player);

    const updatedPlayer: GetPlayerDto =
      await this.playerRepository.save(player);
    console.log(updatedPlayer);

    const sanitizedPlayer: GetPlayerDto = {
      ...updatedPlayer,
      id: undefined,
    };

    return sanitizedPlayer;
  }

  async deletePlayerLink(
    id: string,
    deleteSocialMediaLinkDto: DeleteSocialMediaDto,
  ): Promise<string> {
    await this.userService.getUser(id);

    const player = await this.playerRepository.findOne({ where: { id } });

    if (!player) {
      throw new NotFoundException("This user is not a player");
    }

    const response = HandleDeleteSocialMediaLink(
      deleteSocialMediaLinkDto,
      player,
    );

    console.log(player);

    const updatedPlayer: GetPlayerDto =
      await this.playerRepository.save(player);
    console.log(updatedPlayer);

    if (updatedPlayer) {
      return response;
    } else return "Cannot Save player after deleting";
  }

  async getPlayerLink(id: string): Promise<AddSocialMediaLinkDto> {
    await this.userService.getUser(id);

    const player = await this.getPlayer(id);

    if (!player) {
      throw new NotFoundException("This user is not a player");
    }

    return {
      fbLink: player.fbLink,
      instaLink: player.instaLink,
      xLink: player.xLink,
    };
  }
}
