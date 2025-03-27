import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Response,
  Request,
  HttpException,
  HttpStatus,
  UseGuards,
  Param,
  ParseUUIDPipe,
  Query,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { JwtAuthGuard } from "../auth/local-auth/jwt-auth.guard";
import { UserType } from "src/common/enums/user/user-type.enum";
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery } from "@nestjs/swagger";
import { LoginUserDto } from "./dto/login-user.dto";
import { GetUserDto } from "./dto/get-user.dto";
import { UUID } from "crypto";

@Controller("api/user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 1. Register General User
  @Post("/register")
  async createUser(@Body() createUserDto: CreateUserDto, @Response() res) {
    try {
      const accessToken: string = await this.userService.RegisterUser(createUserDto);
      // res.cookie('access_token', accessToken, {
      //   httpOnly: true,
      //   maxAge: httpOnlyCookieMaxAge, //1 year
      // });
      return res.status(200).send({ message: 'User registered successfully',success:true, accessToken });

    } catch (error) {
      console.error("[REGISTER_USER_CTRL]:", error);
      throw new HttpException(
        error.message || "Internal Server Error",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 2. login general user
  // below d is commented because we are using the jwt strategy to validate the token and get the user details from the token itself so cant expect a token at this point.
  // @UseGuards(JwtAuthGuard)
  @Post('/login')
  async loginUser(
    @Body() loginUserDto: LoginUserDto,
    @Request() req,
    @Response() res,
  ) {
    try {
      const [accessToken, user]: [string, GetUserDto] =
        await this.userService.loginUser(loginUserDto);

      // res.cookie('access_token', accessToken, {
      //   httpOnly: true,
      //   maxAge: httpOnlyCookieMaxAge, //1 year
      // });
      return res.status(200).send({ message: 'User logged in successfully', succes: true,accessToken, user });

    } catch (error) {
      console.error("[LOGIN_USER_CTRL]:", error);
      throw new HttpException(
        error.message || "Internal Server Error",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 3. get general user
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  async getUser(@Request() req, @Response() res) {
    try {
      const { id } = req.user;
      const user = await this.userService.getUser(id);
      
      res.status(200).send({ user, success: true });
    } catch (error) {
      console.error("[GET_USER_CTRL]:", error);
      throw new HttpException(
        error.message || "Internal Server Error",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 5. Delete General User
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete()
  async deleteUser(@Request() req, @Response() res): Promise<UpdateUserDto> {
    try {
      const { id } = req.user;
      await this.userService.deleteUser(id);
      return res
        .status(200)
        .send({ id, message: "User deleted successfully", success: true });
    } catch (error) {
      console.error("[DELETE_USER_CTRL]:", error);
      throw new HttpException(
        error.message || "Internal Server Error",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get("/is-username-exist/:username")
  async isUsernameExist(@Param("username") username: string, @Response() res) {
    try {
      if(!username) {
        throw new HttpException(
          "Username is required",
          HttpStatus.BAD_REQUEST)
        }

        if (!username.startsWith('@')) {
          throw new HttpException('Username must start with @', HttpStatus.BAD_REQUEST);
        }
      const isExist = await this.userService.doesUsernameExist(username);
      return res.status(200).send({ exist: isExist, success: true, username });

    } catch (error) {
      console.error("[REGISTER_USER_CTRL]:", error);
      throw new HttpException(
        error.message || "Internal Server Error",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get("/:id")
  @ApiParam({
    name: "id",
    type: "string",
    format: "uuid",
    description: "The ID of the user",
  })
  @ApiQuery({
    name: "userId",
    type: "string",
    format: "uuid",
    required: false, // Explicitly making it optional
    description: "Optional user ID of the requester",
  })
  async getById(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Query("userId") userId?: string
  ) {
    const validUserId = userId ? await new ParseUUIDPipe().transform(userId, { type: "query" }) : undefined;
    return await this.userService.getUser(id, validUserId);
  }
    
  @Get("/search/:searchTerm")
  async searchUserByNameOrUsername(@Param("searchTerm") searchTerm: string)
  {
    return await this.userService.searchUserByNameOrUsername(searchTerm);
  }

}
