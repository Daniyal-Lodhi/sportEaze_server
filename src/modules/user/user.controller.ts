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
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { JwtAuthGuard } from "../auth/local-auth/jwt-auth.guard";
import { httpOnlyCookieMaxAge } from "src/common/consts/common-const";
import { UserType } from "src/common/enums/user-type.enum";

@Controller("api/user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 1. Register General User
  @Post("/register-user")
  async createUser(@Body() createUserDto: CreateUserDto, @Response() res) {
    try {
      const accessToken: string = await this.userService.RegisterUser(createUserDto);
      // res.cookie('access_token', accessToken, {
      //   httpOnly: true,
      //   maxAge: httpOnlyCookieMaxAge, //1 year
      // });
      return res.status(200).send({ message: 'User registered successfully',success:true,accessToken, UserType: UserType.FAN });

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
  @Post('/login-user')
  async loginUser(
    @Body() createUserDto: CreateUserDto,
    @Request() req,
    @Response() res,
  ) {
    try {
      const [accessToken, userType]: [string, UserType] =
        await this.userService.loginUser(createUserDto);

      // res.cookie('access_token', accessToken, {
      //   httpOnly: true,
      //   maxAge: httpOnlyCookieMaxAge, //1 year
      // });
      return res.status(200).send({ message: 'User logged in successfully', succes: true,accessToken, userType });

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
  @Get("/get-user")
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

  // 4. Update General User
  @UseGuards(JwtAuthGuard)
  @Patch("/update-user")
  async updateUser(
    @Request() req,
    @Response() res,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserDto> {
    try {
      const { id } = req.user;
      const updatedUser = await this.userService.updateUser(id, updateUserDto);
      return res.status(200).json({
        message: "User updated successfully",
        success: true,
        user: updatedUser,
      });
    } catch (error) {
      console.error("[UPDATE_USER_CTRL]:", error);
      throw new HttpException(
        error.message || "Internal Server Error",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 5. Delete General User
  @UseGuards(JwtAuthGuard)
  @Delete("/delete-user")
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
}
