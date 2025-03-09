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
  Delete,
  Put,
} from "@nestjs/common";
import { JwtAuthGuard } from "src/modules/auth/local-auth/jwt-auth.guard";
import { ApiBearerAuth } from "@nestjs/swagger";
import { PostCommentsService } from "./post-comments.service";
import { CommentPostDto } from "./dto/post-comment.dto";

@ApiBearerAuth()
@Controller("api/user/post")
export class PostCommentsController {
  constructor(private postCommentSrv: PostCommentsService) {}

  // ✅ Create a Comment
  @UseGuards(JwtAuthGuard)
  @Post("/comment/:postId")
  async createComment(
    @Param("postId") postId: string,
    @Request() req,
    @Body() body: CommentPostDto,
    @Response() res
  ) {
    try {
      const commentData = await this.postCommentSrv.createComment(
        req.user.id,
        postId,
        body.content
      );
      res.status(201).json({
        success: true,
        message: "Comment added successfully",
        comment: commentData,
      });
    } catch (error) {
      console.error("[CREATE_COMMENT]:", error);
      throw new HttpException(
        error.message || "Internal Server Error",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // ✅ Edit a Comment
  @UseGuards(JwtAuthGuard)
  @Put("/comment/:commentId")
  async editComment(
    @Param("commentId") commentId: string,
    @Request() req,
    @Body() body: CommentPostDto,
    @Response() res
  ) {
    try {
      const updatedComment = await this.postCommentSrv.editComment(
        commentId,
        req.user.id,
        body.content
      );
      res.status(200).json({
        success: true,
        message: "Comment updated successfully",
        comment: updatedComment,
      });
    } catch (error) {
      console.error("[EDIT_COMMENT]:", error);
      throw new HttpException(
        error.message || "Internal Server Error",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // ✅ Delete a Comment
  @UseGuards(JwtAuthGuard)
  @Delete("/comment/:commentId")
  async deleteComment(
    @Param("commentId") commentId: string,
    @Request() req,
    @Response() res
  ) {
    try {
      const deletedComment = await this.postCommentSrv.deleteComment(
        commentId,
        req.user.id
      );
      res.status(200).json({
        success: true,
        message: "Comment deleted successfully",
        comment: deletedComment,
      });
    } catch (error) {
      console.error("[DELETE_COMMENT]:", error);
      throw new HttpException(
        error.message || "Internal Server Error",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // ✅ Get All Comments for a Post
  @Get("/comments/:postId")
  async getComments(@Param("postId") postId: string, @Response() res) {
    try {
      const comments = await this.postCommentSrv.getComments(postId);
      res.status(200).json({ success: true, comments });
    } catch (error) {
      console.error("[GET_COMMENTS]:", error);
      throw new HttpException(
        error.message || "Internal Server Error",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
