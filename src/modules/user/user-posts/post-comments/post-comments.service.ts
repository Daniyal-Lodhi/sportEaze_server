import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserPost } from "../entities/user-post.entity";
import { Comment } from "../entities/post-comment.entity";
import { UserService } from "../../user.service";

@Injectable()
export class PostCommentsService {
  constructor(
    @InjectRepository(UserPost)
    private readonly postRepository: Repository<UserPost>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly userSrv: UserService
  ) {}

  // ✅ Create a Comment
  async createComment(userId: string, postId: string, content: string) {
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException("Post not found");

    const newComment = this.commentRepository.create({ userId, postId, content });
    await this.commentRepository.save(newComment);

    return { success: true, message: "Comment added successfully", comment: newComment };
  }

  // ✅ Edit a Comment
  async editComment(commentId: string, userId: string, newContent: string) {
    const comment = await this.commentRepository.findOne({ where: { id: commentId, userId } });
    if (!comment) throw new NotFoundException("Comment not found or unauthorized");

    comment.content = newContent;
    await this.commentRepository.save(comment);

    return { success: true, message: "Comment updated successfully",comment };
  }

  // ✅ Delete a Comment
  async deleteComment(commentId: string, userId: string) {
    const comment = await this.commentRepository.findOne({ where: { id: commentId, userId } });
    if (!comment) throw new NotFoundException("Comment not found or unauthorized");

    await this.commentRepository.remove(comment);
    return { success: true, message: "Comment deleted successfully" };
  }

  // ✅ Get All Comments for a Post
  async getComments(postId: string) {
    // Fetch comments with user details
    const comments = await this.commentRepository.find({
      where: { postId },
      relations: ["user"],
    });
  
    // Count total comments for the post
    const commentCount = await this.commentRepository.count({ where: { postId } });
  
    return {
      commentCount,
      comments: comments.map(comment => ({
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        user: {
          userId: comment.user.id,
          userName: comment.user.name,
        },
      })),
    };
  }
  
}
