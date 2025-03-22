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
  async getComments(postId: string, pageSize: number, pageNo: number) {
    const [comments, commentCount] = await this.commentRepository.findAndCount({
      where: { postId, parentComment: null }, // Fetch only top-level comments
      relations: ["user"],
      order: { createdAt: "DESC" }, // Fetch latest comments first
      skip: (pageNo - 1) * pageSize, // Pagination logic
      take: pageSize,
    });

    return {
      commentCount, // Total number of top-level comments
      currentPage: pageNo,
      totalPages: Math.ceil(commentCount / pageSize),
      comments: comments.map(comment => ({
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        user: {
          userId: comment.user.id,
          userName: comment.user.fullName,
        },
      })),
    };
}


  // ✅ Get replies of a specific comment
  async getCommentReplies(commentId: string, pageSize: number, pageNo: number) {
    const comment = await this.commentRepository.findOne({ where: { id: commentId } });
    if (!comment) throw new NotFoundException("Comment not found");
  
    const [replies, totalReplies] = await this.commentRepository.findAndCount({
      where: { parentComment: { id: commentId } },
      relations: ["user"],
      order: { createdAt: "ASC" }, // ✅ Oldest replies first, change to "DESC" if needed
      skip: (pageNo - 1) * pageSize, // ✅ Pagination logic
      take: pageSize,
    });
  
    return {
      totalReplies, // ✅ Total number of replies (for client-side pagination handling)
      currentPage: pageNo,
      totalPages: Math.ceil(totalReplies / pageSize),
      replies: replies.map(reply => ({
        id: reply.id,
        content: reply.content,
        createdAt: reply.createdAt,
        user: {
          userId: reply.user.id,
          userName: reply.user.fullName,
        },
      })),
    };
  }
  
}
