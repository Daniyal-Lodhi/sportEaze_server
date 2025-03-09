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

  // ✅ Create a Comment or Reply
  async createComment(userId: string, postId: string, content: string, parentCommentId?: string) {
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException("Post not found");

    let parentComment: Comment | null = null;
    if (parentCommentId) {
      parentComment = await this.commentRepository.findOne({ where: { id: parentCommentId } });
      if (!parentComment) throw new NotFoundException("Parent comment not found");
    }

    const newComment = this.commentRepository.create({ userId, postId, content, parentComment });
    await this.commentRepository.save(newComment);

    return { success: true, message: "Comment added successfully", comment: newComment };
  }

  // ✅ Edit a Comment or Reply
  async editComment(commentId: string, userId: string, newContent: string) {
    const comment = await this.commentRepository.findOne({ where: { id: commentId, userId } });
    if (!comment) throw new NotFoundException("Comment not found or unauthorized");

    comment.content = newContent;
    await this.commentRepository.save(comment);

    return { success: true, message: "Comment updated successfully", comment };
  }

  // ✅ Delete a Comment or Reply (Cascades to Replies)
  async deleteComment(commentId: string, userId: string) {
    const comment = await this.commentRepository.findOne({ where: { id: commentId, userId } });
    if (!comment) throw new NotFoundException("Comment not found or unauthorized");

    await this.commentRepository.remove(comment);
    return { success: true, message: "Comment deleted successfully" };
  }

  // ✅ Get All Comments for a Post (Including Replies)
  async getComments(postId: string) {
    const comments = await this.commentRepository.find({
      where: { postId, parentComment: null }, // Only fetch top-level comments
      relations: ["user"],
    });

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

  // ✅ Get replies of a specific comment
  async getCommentReplies(commentId: string) {
    const comment = await this.commentRepository.findOne({ where: { id: commentId } });
    if (!comment) throw new NotFoundException("Comment not found");

    const replies = await this.commentRepository.find({
      where: { parentComment: { id: commentId } },
      relations: ["user"],
    });

    return {
      replyCount: replies.length,
      replies: replies.map(reply => ({
        id: reply.id,
        content: reply.content,
        createdAt: reply.createdAt,
        user: {
          userId: reply.user.id,
          userName: reply.user.name,
        },
      })),
    };
  }
}
