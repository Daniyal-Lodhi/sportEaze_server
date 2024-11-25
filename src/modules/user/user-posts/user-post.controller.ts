import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Response,
  HttpException,
  HttpStatus,
  Get,
  Param,
} from "@nestjs/common";
import { JwtAuthGuard } from "src/modules/auth/local-auth/jwt-auth.guard";
import { CreateTextPostDTO } from "./dto/create-text-post.dto";
import { UserPostService } from "./user-post.service";
import { CreateMediaPostDTO } from "./dto/create-media-post.dto";

@UseGuards(JwtAuthGuard)
@Controller("api/user/post")
export class UserPostController {
  constructor(private PostSrv: UserPostService) {}

  // creating only text user posts
  @Post("/create-text-post")
  async createTextPost(
    @Body() CreateTextPostDTO: CreateTextPostDTO,
    @Request() req,
    @Response() res,
  ) {
    try {
      const createdTextPost = await this.PostSrv.createTextPost(
        req.user.id,
        CreateTextPostDTO,
      );
      res.status(200).json({ success: true, post: createdTextPost });
    } catch (error) {
      console.error("[CREATE_USER_POST_CTRL]:", error);
      throw new HttpException(
        error.message || "Internal Server Error",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post("/create-media-post")
  async createMediaPost(
    @Body() CreateMediaPostDTO: CreateMediaPostDTO,
    @Request() req,
    @Response() res,
  ) {
    try {
      const createdMediaPost = await this.PostSrv.createMediaPost(
        req.user.id,
        CreateMediaPostDTO,
      );
      res.status(200).json({ success: true, post: createdMediaPost });
    } catch (error) {
      console.error("[CREATE_USER_POST_CTRL]:", error);
      throw new HttpException(
        error.message || "Internal Server Error",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get("/get-post/:postId")
  async getPostById(@Response() res, @Param("postId") postId: string) {
    try {
      const post = await this.PostSrv.getPostById(postId);
      res.status(200).json({ success: true, post });
    } catch (error) {
      console.error("[GET_USER_POST_CTRL]:", error);
      throw new HttpException(
        error.message || "Internal Server Error",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get("/get-post")
  async getPost(@Request() req, @Response() res) {
    try {
      const post = await this.PostSrv.getPost(req.user.id);
      res.status(200).json({ success: true, post });
    } catch (error) {
      console.error("[GET_USER_POST_CTRL]:", error);
      throw new HttpException(
        error.message || "Internal Server Error",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
