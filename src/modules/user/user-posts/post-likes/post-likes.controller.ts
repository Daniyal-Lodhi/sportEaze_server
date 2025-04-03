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
import { UserPostService } from "../user-post.service";
import { ApiBearerAuth } from "@nestjs/swagger";
import { PostLikesService } from "./post-likes.service";
import { LikePostDto } from "./dto/post-like.dto";

@Controller("api/user/post")
export class PostLikesController {
  constructor(private PostSrv: UserPostService,private postLikeSrv:PostLikesService) {}
  
  // creating only text user posts
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('/like/:postId')
  async likePost(@Param('postId') postId: string, @Request() req, @Response() res,@Body() body:LikePostDto) {
    try {
      const likeData = await this.postLikeSrv.likePost(req.user.id, postId,body.reactType,body.unLike);
      res.status(200).json({ success: true, liked: likeData.liked, likeCount: likeData.likeCount,reactType:likeData.reactType });
    } catch (error) {
      console.error("[LIKE_POST]:", error);
      throw new HttpException(
        error.message || "Internal Server Error",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } 
  }

  @Get('/likes/:postId')
async getPostLikes(@Param('postId') postId: string, @Response() res) {
  try {
    const likeData = await this.postLikeSrv.getPostLikes(postId);
    res.status(200).json({
      success: true,
      likeCount: likeData.likeCount,
      reactions: likeData.reactions,
      users: likeData.users, // List of users (only id & name)
    });
  } catch (error) {
    console.error("[GET_POST_LIKES]:", error);
    throw new HttpException(
      error.message || "Internal Server Error",
      error.status || HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}


 
}
