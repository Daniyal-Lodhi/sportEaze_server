import {
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
import { Repository } from "typeorm";
import { LocalAuthService } from "../auth/local-auth/local-auth.service";
import { hashPassword } from "src/common/utils/user-utils";
import { UserType } from "src/common/enums/user-type.enum";
import { GetUserDto } from "./dto/get-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { RegisterUserDto } from "./dto/register-user.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private localAuthSrv: LocalAuthService,
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
    user.userType = UserType.FAN;
    const savedUser = await this.userRepository.save(user);

    const { id, userType } = savedUser;

    const accessToken: string = this.localAuthSrv.getAccessToken(id, userType);
    return accessToken;
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<[string, UserType]> {
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
        "This account was deleted, send an additional field 'recover:true' for account recovery.",
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
    return [accessToken, user.userType];
  }

  async getUser(id: string): Promise<GetUserDto> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (user?.deleted || !user) {
      throw new NotFoundException("User not found");
    }
    const { password, ...userWoPass } = user;
    return userWoPass as GetUserDto;
  }

  async updateUser(
    id: string,
    updateUserDto: RegisterUserDto | UpdateUserDto,
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

    let updatedData;
    if ('password' in updateUserDto) {
      updatedData = { ...updateUserDto };
      updatedData.password = await hashPassword(updateUserDto.password);
    }
    else updatedData = { ...updateUserDto };

    try {
      const updatedUser = await this.userRepository.save({
        ...user,
        ...updatedData,
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
    const user = await this.userRepository.findOne({ where: { username } });
    return !!user;
  }


}
