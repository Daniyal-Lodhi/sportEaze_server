import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { ILike, IsNull, Not, Repository } from "typeorm";
import { LocalAuthService } from "../auth/local-auth/local-auth.service";
import { hashPassword } from "src/common/utils/user-utils";
import { UserType } from "src/common/enums/user/user-type.enum";
import { GetUserDto } from "./dto/get-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { RegisterUserDto } from "./dto/register-user.dto";
import { DEFAULT_USER_PROFILE_PIC_URL } from "src/common/consts/user-const";
import { NetworkService } from "./network/network.service";
import { ConnectionStatus } from "src/common/enums/network/network.enum";
import { SharedPost } from "./user-posts/entities/shared-post.entity";
import { Endorsement } from "src/common/entities/endorsement.entity";
import { UserPost } from "./user-posts/entities/user-post.entity";
import { Comment } from "./user-posts/entities/post-comment.entity";
import { PostLikes } from "./user-posts/entities/post-like.entity";
import { LikePostDto } from "./user-posts/post-likes/dto/post-like.dto";
import { Contract } from "../contracts/entities/contract.entity";
import { ContractStatus } from "src/common/enums/contracts/contracts.enum";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(UserPost) private userPostRepository: Repository<UserPost>,
    @InjectRepository(SharedPost) private sharedPostRepository: Repository<SharedPost>,
    @InjectRepository(Comment) private postCommentRepository: Repository<Comment>,
    @InjectRepository(PostLikes) private postLikeRepository: Repository<PostLikes>,
    @InjectRepository(Endorsement) private endorsementRepository: Repository<Endorsement>,
    @InjectRepository(Contract) private contractsRepository: Repository<Contract>,
    private localAuthSrv: LocalAuthService,
    private networkService: NetworkService,
    // private UserPostService: UserPostService,
    
  ) {}

  async RegisterUser(createUserDto: CreateUserDto): Promise<string> {
    const user: User = new User();
    const existingUser = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });
    if (existingUser && existingUser.deleted) {
      throw new ConflictException(
        "This account was deleted, log in to this account for recvoery options",
      );
    }

    if (existingUser) {
      throw new ConflictException("User with this email already exists");
    }

    createUserDto.password = await hashPassword(createUserDto.password);

    user.email = createUserDto.email;
    user.password = createUserDto.password;
    // user.userType = UserType.FAN;
    const savedUser = await this.userRepository.save(user);

    const { id, userType } = savedUser;

    const accessToken: string = this.localAuthSrv.getAccessToken(id, userType);
    return accessToken;
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<[string, GetUserDto]> {
    const user = await this.userRepository.findOne({
      where: { email: loginUserDto.email },
    });
    // checkng if user exist
    if (!user) {
      throw new NotFoundException("Invalid credentials");
    }
    // asking for recover and sending error if user is flagged deleted
    if (user && user.deleted && !loginUserDto.recover) {
      throw new ConflictException(
        // "This account was deleted, send an additional field 'recover:true' for account recovery.",
        "Invalid credentials",
      );
    }
    // setting delete flag to false
    if (loginUserDto.recover && user.deleted) {
      await this.userRepository.save({
        ...user,
        deleted: false,
      });
    }
    const validPwd: boolean = await this.localAuthSrv.verifyPassword(
      loginUserDto.email,
      loginUserDto.password,
    );
    if (!validPwd) {
      throw new UnauthorizedException("Invalid credentials");
    }
    const accessToken: string = this.localAuthSrv.getAccessToken(
      user.id,
      user.userType,
    );
    return [accessToken, await this.getUser(user.id)];
  }

  async getUser(id: string, userId?: string | undefined): Promise<GetUserDto> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ["player", "patron", "mentor", "patron.wallet", "player.wallet"],
    });

    if (user?.deleted || !user) {
      throw new NotFoundException("User not found");
    }

    let isFollowing: boolean | undefined = undefined;
    let connection: {id: string, status: ConnectionStatus, receiverId: string} = { id: undefined, status: ConnectionStatus.REJECTED, receiverId: undefined };
    
    if(userId) {

      isFollowing = await this.networkService.isUserFollowingUser(userId, id);
      connection = await this.networkService.getConnectionStatusBetweenUsers(userId, id);
    }

    const followerCount: number = await this.networkService.getFollowersCount(id);
    const connectionCount: number = await this.networkService.getConnectionsCount(id);
    const pendingConnectionCount: number = await this.networkService.getPendingConnectionsCount(id);


    const sharedPostCount = await this.sharedPostRepository.count({ where: { user } });

    const endorsementsGiven = await this.endorsementRepository.count({ where: { mentor: { user } } });
    const endorsementsReceived = await this.endorsementRepository.count({ where: { player: { user } } });

    const countSharedPosts = await this.sharedPostRepository.count({ where: { originalPost: { userId: id }  } });

    const commentsCount = await this.postCommentRepository.count({ where: { post: { userId: id } } });

    const userPostLikesCount = await this.postLikeRepository.count({ where: { post: { userId: id } } });

    const totalContracts = await this.contractsRepository.count({ where: {  patron: { id }, status: Not(ContractStatus.PENDING) } });

    return {
      ...user,
      player: user.player ? { ...user.player, followerCount, pendingConnectionCount, endorsementsReceived, countSharedPosts, commentsCount, userPostLikesCount } : undefined, 
      patron: user.patron ? { ...user.patron, totalContracts } : undefined,
      mentor: user.mentor ? { ...user.mentor, endorsementsGiven } : undefined,
      isFollowing,
      connection,
      sharedPostCount,
      connectionCount,
      followerCount,
    } as GetUserDto;
    
  }

  async updateUser(
    id: string,
    updateUserDto: RegisterUserDto | UpdateUserDto,
    userType: UserType
  ): Promise<GetUserDto> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.deleted) {
      throw new ConflictException(
        'This account was deleted, log in to this account for recovery options',
      );
    }

    if(userType == UserType.SUPERUSER) {
        throw new BadRequestException('Invalid user type');      
    }

    if ('username' in updateUserDto) {
      if (await this.doesUsernameExist((updateUserDto as RegisterUserDto).username)) {
        throw new ConflictException('Username already taken');
      }
    }

    let updatedData;
    if ('password' in updateUserDto) {
      updatedData = { ...updateUserDto };
      updatedData.password = await hashPassword(updateUserDto.password);
    }
    else updatedData = { ...updateUserDto };

    if (!updateUserDto.profilePicUrl) {
      updateUserDto.profilePicUrl = DEFAULT_USER_PROFILE_PIC_URL;
    }
    
    try {
      const updatedUser = await this.userRepository.save({
        ...user,
        ...updatedData,
        userType
      });
      return updatedUser as GetUserDto;
    } catch (error) {
      console.error('[UPDATE_USER_SERVICE]:', error);
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user || user.deleted) {
      throw new NotFoundException("User not found");
    }

    await this.userRepository.save({
      ...user,
      deleted: true,
    });

    return true;
  }

  async doesUsernameExist(username: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { username: username.toLowerCase() } });
    return !!user;
  }


  async searchUserByNameOrUsername(searchTerm: string, id?: any): Promise<GetUserDto[]> {
    // Ensure searchTerm is valid (optional)
    // if (!searchTerm || searchTerm.trim().length < 2) {
    //   throw new BadRequestException("Search term must be at least 2 characters long.");
    // }
  
      const users = await this.userRepository.find({
        where: [
          { fullName: ILike(`%${searchTerm}%`), userType: Not(IsNull()), id: Not(id) },
          { username: ILike(`%${searchTerm}%`), userType: Not(IsNull()), id: Not(id) },
        ],
        select: {
          id: true,
          userType: true,
          username: true, 
          fullName: true, 
          profilePicUrl: true, 
        },
        take: 20
      });
  
      // // If no users found, throw 404 (Not Found)
      // if (!users.length) {
      //   throw new NotFoundException("No users found matching the search term.");
      // }
  
      return users as GetUserDto[];
  }  

  async getUserType(id?: string | undefined): Promise<UserType | null> {

    if(!id) return null;

    const user = await this.userRepository.findOne({
      where: { id },
      select: ["userType"],
    });
  
    return user?.userType ?? null;
  }

}
