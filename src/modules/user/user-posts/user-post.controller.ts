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
  Query,
} from "@nestjs/common";
import { JwtAuthGuard, OptionalJwtAuthGuard } from "src/modules/auth/local-auth/jwt-auth.guard";
import { CreateTextPostDTO } from "./dto/create-text-post.dto";
import { UserPostService } from "./user-post.service";
import { CreateMediaPostDTO } from "./dto/create-media-post.dto";
import { ApiBearerAuth } from "@nestjs/swagger";


@Controller("api/user/post")
export class UserPostController {
  constructor(private PostSrv: UserPostService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
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

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
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
  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth()
async getPostById(@Request() req, @Response() res, @Param("postId") postId: string) {
  try {
    const post = await this.PostSrv.getPostById(postId, req.user?.id);

    res.status(200).json({
      success: true,
      post: {
        ...post,
        likeCount: post.likeCount|| 0, // Total likes count
        // reactions: post.reactions || {},   // Reaction type breakdown
        reactions: undefined,   // Reaction type breakdown
      },
    });
  } catch (error) {
    console.error("[GET_USER_POST_CTRL]:", error);

    throw new HttpException(
      error.message || "Internal Server Error",
      error.status || HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}


@Get("/get-posts/:userid")
async getPost(
  @Request() req,
  @Response() res,
  @Param("userid") userId: string,
  @Query("pageSize") pageSize?: string,
  @Query("pageNo") pageNo?: string
) {
  try {
    // const userId = req.user.id;
    const page = pageNo ? parseInt(pageNo, 10) : 1;
    const size = pageSize ? parseInt(pageSize, 10) : 10; // Default: 10 posts per page

    if (isNaN(page) || isNaN(size) || page < 1 || size < 1) {
      throw new HttpException("Invalid pagination parameters", HttpStatus.BAD_REQUEST);
    }

    console.log(`Fetching posts for user: ${userId}, Page: ${page}, Page Size: ${size}`);

    const posts = await this.PostSrv.getPosts(req.user.id, userId, size, page);

    return res.status(200).json({ success: true, ...posts });

  } catch (error) {
    console.error("[GET_USER_POST_CTRL]:", error);
    throw new HttpException(
      error.message || "Internal Server Error",
      error.status || HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}

@Get("/shares/:postId")
async getShares(@Param("postId") postId: string) {
  try {
    const shares = await this.PostSrv.getShares(postId);
    return { success: true, shares };
  } catch (error) {
    console.error("[GET_USER_POST_CTRL]:", error);
    throw new HttpException(
      error.message || "Internal Server Error",
      error.status || HttpStatus.INTERNAL_SERVER_ERROR
    );
  }

}
}
