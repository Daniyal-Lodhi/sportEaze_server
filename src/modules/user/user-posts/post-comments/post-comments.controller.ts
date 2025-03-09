import { Controller, Post, Put, Delete, Get, Param, Body, Req, UseGuards } from "@nestjs/common";
import { PostCommentsService } from "./post-comments.service";
import { JwtAuthGuard } from "src/modules/auth/local-auth/jwt-auth.guard";


@Controller("comments")
export class PostCommentsController {
  constructor(private readonly postCommentsService: PostCommentsService) {}

  // ✅ Create a Comment or Reply
  @UseGuards(JwtAuthGuard)
  @Post(":postId")
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
  @Put(":commentId")
  async editComment(
    @Req() req,
    @Param("commentId") commentId: string,
    @Body("content") newContent: string
  ) {
    return this.postCommentsService.editComment(commentId, req.user.id, newContent);
  }

  // ✅ Delete a Comment or Reply
  @UseGuards(JwtAuthGuard)
  @Delete(":commentId")
  async deleteComment(@Req() req, @Param("commentId") commentId: string) {
    return this.postCommentsService.deleteComment(commentId, req.user.id);
  }

  // ✅ Get All Comments for a Post (Auth Required)
  @Get("post/:postId")
  async getComments(@Param("postId") postId: string) {
    return await this.postCommentsService.getComments(postId);
  }

  // ✅ Get replies of a specific comment
  @Get(":commentId/replies")
  async getCommentReplies(@Param("commentId") commentId: string) {
    return await this.postCommentsService.getCommentReplies(commentId);
  }
}
