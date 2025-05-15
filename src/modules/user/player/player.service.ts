import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { UpdatePlayerDto } from "./dto/update-player.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Not, Repository } from "typeorm";
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
import { formatToLocalDateTime } from "src/common/utils/dayjs.helper";
import { ConnectionStatus } from "src/common/enums/network/network.enum";
import { NetworkService } from "../network/network.service";
import { ContractStatus } from "src/common/enums/contracts/contracts.enum";
import { SharedPost } from "../user-posts/entities/shared-post.entity";
import { Contract } from "src/modules/contracts/entities/contract.entity";
import { PostLikes } from "../user-posts/entities/post-like.entity";
import { UserPost } from "../user-posts/entities/user-post.entity";
import { Comment } from "../user-posts/entities/post-comment.entity";
import { shuffleArray } from "src/common/utils/shuffle-array";

@Injectable()
export class PlayerService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    @InjectRepository(Endorsement)
    private readonly endorsementRepository: Repository<Endorsement>,
    private readonly networkService: NetworkService,

    @InjectRepository(SharedPost)
    private readonly sharedPostRepository: Repository<SharedPost>,
    @InjectRepository(Contract)
    private contractsRepository: Repository<Contract>,
    @InjectRepository(Comment)
    private postCommentRepository: Repository<Comment>,
    @InjectRepository(PostLikes)
    private postLikeRepository: Repository<PostLikes>,
    @InjectRepository(UserPost)
    private userPostRepository: Repository<UserPost>,
  ) {}

  async RegisterPlayer(
    id: string,
    registerPlayerDto: RegisterPlayerDto,
  ): Promise<GetUserDto> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user || user.deleted) {
      throw new NotFoundException(`User not found`);
    }

    if (user.userType !== UserType.FAN && user.userType !== null) {
      throw new ConflictException(
        `Since this account is registered as ${UserType[user.userType]}, you cannot change it to a player`,
      );
    }

    const { profilePicUrl, fullName, username, dob, gender, ...playerDetails } =
      registerPlayerDto;

    const updateUserDto: BaseUserDto = {
      profilePicUrl,
      fullName,
      username,
      dob,
      gender,
    };

    await this.userService.updateUser(id, updateUserDto, UserType.PLAYER);

    const player = Object.assign(new Player(), { id, ...playerDetails });

    const wallet = this.walletRepository.create({
      cash: 0,
      payables: null,
      player,
    });
    player.wallet = wallet;

    await this.playerRepository.save(player);
    await this.walletRepository.save(wallet);

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
      relations: ["user", "wallet"],
    });

    if (!player) {
      throw new NotFoundException(`Player with ID ${id} not found`);
    }

    if (player.user) {
      Object.assign(player.user, {
        profilePicUrl:
          updatePlayerDto.profilePicUrl ?? player.user.profilePicUrl,
        fullName: updatePlayerDto.fullName ?? player.user.fullName,
        dob: updatePlayerDto.dob ?? player.user.dob,
        gender: updatePlayerDto.gender ?? player.user.gender,
      });

      await this.userRepository.save(player.user);
    }

    const { walletTotal, walletPending, ...playerUpdates } = {
      ...updatePlayerDto,
    };

    delete playerUpdates.profilePicUrl;
    delete playerUpdates.fullName;
    delete playerUpdates.dob;
    delete playerUpdates.gender;

    Object.assign(player, playerUpdates);
    player.wallet.cash = walletTotal ?? player.wallet.cash;
    player.wallet.payables = walletPending ?? player.wallet.payables;

    await this.playerRepository.save(player);
    await this.walletRepository.save(player.wallet);

    return this.userService.getUser(id);
  }

  async getTrendingPlayers(userId: string): Promise<GetPlayerDto[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ["player"],
    });

    if (!user || user.deleted) {
      throw new NotFoundException("User not found");
    }

    const sportInterests = user.sportInterests ?? [];
    // console.log("User's sportInterests:", sportInterests);

    const players = await this.playerRepository.find({
      relations: [
        "user",
        "user.posts",
        "user.posts.likes",
        "user.posts.comments",
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
        sportInterests.includes(s),
      );
      const hasInterestMatch = matchPrimary || matchSecondary;

      return {
        player,
        score: engagementScore,
        interestMatch: hasInterestMatch,
      };
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
      .map(
        ({ player }) =>
          ({
            ...player,
            id: undefined,
            user: {
              ...player.user,
              password: undefined,
            },
          }) as GetPlayerDto,
      );

    // console.log("Final sorted trending players:", sortedPlayers.map(p => p.user.fullName));

    return sortedPlayers;
  }

  async getEndorsements(playerid: string) {
    const endorsements = await this.endorsementRepository.find({
      where: { player: { id: playerid } },
      relations: ["mentor", "mentor.user", "player", "player.user"],
      order: { createdAt: "DESC" },
    });

    if (!endorsements) {
      throw new NotFoundException(`Player with ID ${playerid} not found`);
    }

    return endorsements.map((endorsement) => ({
      ...endorsement,
      createdAt: formatToLocalDateTime(endorsement.createdAt),
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
      },
    }));
  }

async getPreferred(id: string) {
  console.log(`[getPreferred] Fetching user with id: ${id}`);
  const user = await this.userService.getUser(id);
  console.log(`[getPreferred] User fetched:`, user);

  const allPlayers = await this.playerRepository.find();
  console.log(`[getPreferred] All players fetched (${allPlayers.length})`);

  let filteredPlayers = [];

  // --- FAN ---
  if (user.userType === UserType.FAN) {
    const sports = user.sportInterests ?? [];
    console.log(`[getPreferred][FAN] Interested sports:`, sports);

    filteredPlayers = allPlayers.filter(player =>
      sports.includes(player.primarySport) ||
      player.secondarySports?.some(s => sports.includes(s))
    );
  }

  // --- PLAYER ---
  else if (user.userType === UserType.PLAYER) {
    const primary = user.player.primarySport;
    const secondary = user.player.secondarySports ?? [];
    console.log(`[getPreferred][PLAYER] Primary: ${primary}, Secondary:`, secondary);

    filteredPlayers = allPlayers.filter(player =>
      player.primarySport === primary ||
      secondary.includes(player.primarySport) ||
      player.secondarySports?.some(s => [primary, ...secondary].includes(s))
    );
  }

  // --- MENTOR ---
  else if (user.userType === UserType.MENTOR) {
    const primary = user.mentor.primarySport;
    const interests = user.mentor.sportInterests ?? [];
    console.log(`[getPreferred][MENTOR] Primary: ${primary}, Interests:`, interests);

    filteredPlayers = allPlayers.filter(player =>
      player.primarySport === primary ||
      interests.includes(player.primarySport) ||
      player.secondarySports?.some(s => [primary, ...interests].includes(s))
    );

    if (filteredPlayers.length === 0) {
      console.log(`[getPreferred][MENTOR] No matches found, fallback to all players`);
      filteredPlayers = allPlayers;
    }
  }

  // --- PATRON ---
  else if (user.userType === UserType.PATRON) {
    const sports = user.patron.supportedSports ?? [];
    const levels = user.patron.preferredPlayerLevels ?? [];
    console.log(`[getPreferred][PATRON] Supported sports:`, sports);
    console.log(`[getPreferred][PATRON] Preferred levels:`, levels);

    filteredPlayers = allPlayers.filter(player =>
      sports.includes(player.primarySport) ||
      player.secondarySports?.some(s => sports.includes(s)) ||
      levels.includes(player.playingLevel)
    );

    if (filteredPlayers.length === 0) {
      console.log(`[getPreferred][PATRON] No matches found, fallback to all players`);
      filteredPlayers = allPlayers;
    }
  }

  if (filteredPlayers.length === 0) {
    console.log(`[getPreferred] No matches found at all, fallback to all players`);
    filteredPlayers = allPlayers;
  }

  const data = await Promise.all(
    filteredPlayers.map((player) => this.userService.getUser(player.id))
  );

  console.log(`[getPreferred] Final matched user data:`, data);

  return shuffleArray(data).slice(0, 10);
}

  async getPlayerForComparision(username: string, userId?: string | undefined) {
    const player = await this.userRepository.findOne({
      where: { username },
      relations: [
        "player",
        "patron",
        "mentor",
        "patron.wallet",
        "player.wallet",
      ],
    });

    if (player?.deleted || !player) {
      throw new NotFoundException("User not found");
    }

    let isFollowing: boolean | undefined = undefined;
    let connection: {
      id: string;
      status: ConnectionStatus;
      receiverId: string;
    } = {
      id: undefined,
      status: ConnectionStatus.REJECTED,
      receiverId: undefined,
    };

    if (userId) {
      isFollowing = await this.networkService.isUserFollowingUser(
        userId,
        player.id,
      );
      connection = await this.networkService.getConnectionStatusBetweenUsers(
        userId,
        player.id,
      );
    }

    const followerCount: number = await this.networkService.getFollowersCount(
      player.id,
    );
    const connectionCount: number =
      await this.networkService.getConnectionsCount(player.id);
    const pendingConnectionCount: number =
      await this.networkService.getPendingConnectionsCount(player.id);

    const sharedPostCount = await this.sharedPostRepository.count({
      where: { user: player },
    });

    const endorsementsGiven = await this.endorsementRepository.count({
      where: { mentor: { user: player } },
    });
    const endorsementsReceived = await this.endorsementRepository.count({
      where: { player: { user: player } },
    });

    const countSharedPosts = await this.sharedPostRepository.count({
      where: { originalPost: { userId: player.id } },
    });

    const commentsCount = await this.postCommentRepository.count({
      where: { post: { userId: player.id } },
    });

    const userPostLikesCount = await this.postLikeRepository.count({
      where: { post: { userId: player.id } },
    });

    const totalContracts: number = await this.contractsRepository.count({ where: [{  patron: { id: player.id }, status: Not(ContractStatus.PENDING) }, {player: { id: player.id }, status: Not(ContractStatus.PENDING)}] });

    const postCount = await this.userPostRepository.count({
      where: { userId: player.id },
    });

    return {
      ...player,
      player: player.player
        ? {
            ...player.player,
            followerCount,
            pendingConnectionCount,
            endorsementsReceived,
            countSharedPosts,
            commentsCount,
            userPostLikesCount,
            postCount,
            totalContracts
          }
        : undefined,
      patron: player.patron ? { ...player.patron, totalContracts } : undefined,
      mentor: player.mentor
        ? { ...player.mentor, endorsementsGiven }
        : undefined,
      isFollowing,
      connection,
      sharedPostCount,
      connectionCount,
      followerCount,
    };
  }
}
