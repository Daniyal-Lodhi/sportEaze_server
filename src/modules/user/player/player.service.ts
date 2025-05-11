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
import { Wallet } from "src/common/entities/wallet.entity";
import { Endorsement } from "src/common/entities/endorsement.entity";

@Injectable()
export class PlayerService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(User) 
    private readonly userRepository: Repository<User>,
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
    @InjectRepository(Wallet) private readonly walletRepository: Repository<Wallet>,
    @InjectRepository(Endorsement) private readonly endorsementRepository: Repository<Endorsement>,
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

    const wallet = this.walletRepository.create({ total: 0, pending: 0 });
    await this.walletRepository.save(wallet);
    player.wallet = wallet;

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
      relations: ['user', "wallet"],
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
  
    const {walletTotal, walletPending, ...playerUpdates} = { ...updatePlayerDto };
    
    delete playerUpdates.profilePicUrl;
    delete playerUpdates.fullName;
    delete playerUpdates.dob;
    delete playerUpdates.gender;
  
    Object.assign(player, playerUpdates);
    player.wallet.total = walletTotal ?? player.wallet.total;
    player.wallet.pending = walletPending ?? player.wallet.pending;

    await this.playerRepository.save(player);
    await this.walletRepository.save(player.wallet);
    
    return this.userService.getUser(id);
  }

  async getTrendingPlayers(userId: string): Promise<GetPlayerDto[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['player'],
    });
  
    if (!user || user.deleted) {
      throw new NotFoundException('User not found');
    }
  
    const sportInterests = user.sportInterests ?? [];
    // console.log("User's sportInterests:", sportInterests);
  
    const players = await this.playerRepository.find({
      relations: [
        'user',
        'user.posts',
        'user.posts.likes',
        'user.posts.comments',
      ],
    });
  
    // console.log("Fetched players:", players.length);
  
    const activePlayers = players.filter((player) => !player.user.deleted);
  
    const scoredPlayers = activePlayers.map((player) => {
      const posts = player.user.posts || [];
      let engagementScore = 0;
  
      posts.forEach((post) => {
        const likes = post.likes?.length || 0;
        const comments = post.comments?.length || 0;
        const shares = post.shareCount || 0;
        engagementScore += likes + comments + shares * 2;
      });
  
      const matchPrimary = sportInterests.includes(player.primarySport);
      const matchSecondary = player.secondarySports?.some((s) =>
        sportInterests.includes(s)
      );
      const hasInterestMatch = matchPrimary || matchSecondary;
  
      return { player, score: engagementScore, interestMatch: hasInterestMatch };
    });
  
    // console.log("Players with engagement scores:", scoredPlayers.map(p => ({
    //   playerId: p.player.user.id,
    //   name: p.player.user.fullName,
    //   score: p.score,
    //   interestMatch: p.interestMatch,
    // })));
  
    const sortedPlayers = scoredPlayers
      .sort((a, b) => {
        if (a.interestMatch !== b.interestMatch) {
          return a.interestMatch ? -1 : 1;
        }
        return b.score - a.score;
      })
      .map(({ player }) => ({
        ...player,
        id: undefined,
        user: {
          ...player.user,
          password: undefined,
        },
      } as GetPlayerDto));
  
    // console.log("Final sorted trending players:", sortedPlayers.map(p => p.user.fullName));
  
    return sortedPlayers;
  }
  
  async getEndorsements(playerid: string) {

    const endorsements = await this.endorsementRepository.find({
      where: { player: { id: playerid } },
      relations: ["mentor", "mentor.user", "player" , "player.user"],
    });

    if (!endorsements) {
      throw new NotFoundException(`Player with ID ${playerid} not found`);
    }

    return endorsements.map((endorsement) => ({
      ...endorsement,
      player: {
        id: endorsement.player.id,
        fullName: endorsement.player.user.fullName,
        profilePicUrl: endorsement.player.user.profilePicUrl,
        username: endorsement.player.user.username,
        userType: endorsement.player.user.userType,
      },
      mentor: {
        id: endorsement.mentor.id,
        fullName: endorsement.mentor.user.fullName,
        profilePicUrl: endorsement.mentor.user.profilePicUrl,
        username: endorsement.mentor.user.username,
        userType: endorsement.mentor.user.userType,
      }
    }));
  }
}
