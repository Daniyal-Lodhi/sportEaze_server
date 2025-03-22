import { Controller, Post, Put, Delete, Get, Param, Body, Req, UseGuards, Query } from "@nestjs/common";
import { PostCommentsService } from "./post-comments.service";
import { JwtAuthGuard } from "src/modules/auth/local-auth/jwt-auth.guard";
import { CommentPostDto } from "./dto/post-comment.dto";
import { ApiBearerAuth } from "@nestjs/swagger";


@Controller("api/user/post")
export class PostCommentsController {
  constructor(private readonly postCommentsService: PostCommentsService) {}

  // ✅ Create a Comment or Reply
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post("comment/:postId")
  async createComment(
    @Req() req,
    @Param("postId") postId: string,
    @Body() body: CommentPostDto,
  ) {
    return this.postCommentsService.createComment(req.user.id, postId, body.content, body.parentCommentId);
  }

  // ✅ Edit a Comment or Reply
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put("comment/:commentId")
  async editComment(
    @Req() req,
    @Param("commentId") commentId: string,
    @Body() body: CommentPostDto
  ) {
    return this.postCommentsService.editComment(commentId, req.user.id, body.content);
  }

  // ✅ Delete a Comment or Reply
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete("comment/:commentId")
  async deleteComment(@Req() req, @Param("commentId") commentId: string) {
    return this.postCommentsService.deleteComment(commentId, req.user.id);
  }

  // ✅ Get All Comments for a Post with Pagination
@Get("comments/:postId")
async getComments(
  @Param("postId") postId: string,
  @Query("pageSize") pageSize: string,
  @Query("pageNo") pageNo: string
) {
  const pageSizeNum = parseInt(pageSize, 10) || 10; // Default page size to 10 if not provided
  const pageNoNum = parseInt(pageNo, 10) || 1; 
  return await this.postCommentsService.getComments(postId, Number(pageSizeNum), Number(pageNoNum));
}


@Get("comment/replies/:commentId")
async getCommentReplies(
  @Param("commentId") commentId: string,
  @Query("pageSize") pageSize: string,
  @Query("pageNo") pageNo: string
) {
  const pageSizeNum = parseInt(pageSize, 10) || 10; // Default page size to 10 if not provided
  const pageNoNum = parseInt(pageNo, 10) || 1; // Default to first page if not provided

  return await this.postCommentsService.getCommentReplies(commentId, pageSizeNum, pageNoNum);
}
}
