import { Controller, Post, Put, Delete, Get, Param, Body, Req, UseGuards, Query } from "@nestjs/common";
import { PostCommentsService } from "./post-comments.service";
import { JwtAuthGuard } from "src/modules/auth/local-auth/jwt-auth.guard";


@Controller("api/user/post")
export class PostCommentsController {
  constructor(private readonly postCommentsService: PostCommentsService) {}

  // ✅ Create a Comment or Reply
  @UseGuards(JwtAuthGuard)
  @Post("comment/:postId")
  async createComment(
    @Req() req,
    @Param("postId") postId: string,
    @Body("content") content: string,
    @Body("parentCommentId") parentCommentId?: string
  ) {
    return this.postCommentsService.createComment(req.user.id, postId, content, parentCommentId);
  }

  // ✅ Edit a Comment or Reply
  @UseGuards(JwtAuthGuard)
  @Put("comment/:commentId")
  async editComment(
    @Req() req,
    @Param("commentId") commentId: string,
    @Body("content") newContent: string
  ) {
    return this.postCommentsService.editComment(commentId, req.user.id, newContent);
  }

  // ✅ Delete a Comment or Reply
  @UseGuards(JwtAuthGuard)
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
