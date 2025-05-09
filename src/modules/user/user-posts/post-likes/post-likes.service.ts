import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserPost } from "../entities/user-post.entity";
import { GetPostDTO } from "../dto/get-post.dto";
import { UserService } from "../../user.service";
import { UserType } from "src/common/enums/user/user-type.enum";
import { PostLikes } from "../entities/post-like.entity";
import { ReactTypeEnum } from "src/common/enums/post/user-posts.enum";
import { PostLikesGateway } from "./post-likes.gateway";
import { NotificationsService } from "src/modules/notifications/notifications.service";
import { NotificationType } from "src/common/enums/notifications/notifications.enum";

@Injectable()
export class PostLikesService {
  constructor(
    @InjectRepository(UserPost)
    private readonly postRepository: Repository<UserPost>,
    @InjectRepository(PostLikes)
    private readonly likeRepository: Repository<PostLikes>,
    private readonly postLikeGateway: PostLikesGateway,
    private readonly notificationsService: NotificationsService,
  ) {}
  async likePost(
    userId: string, 
    postId: string, 
    reactType: ReactTypeEnum, 
    unlike: boolean
  ): Promise<{ liked: boolean; likeCount: number; reactType?: ReactTypeEnum }> {
    
    const post = await this.postRepository.findOne({ where: { id: postId } });
  
    if (!post) {
      throw new Error('Post not found');
    }
  
    // Check if the user has already liked the post
    const existingLike = await this.likeRepository.findOne({ where: { userId, postId } });
  
    if (existingLike) {
      if (unlike) {
        // Explicitly unlike the post if `unlike` is true
        await this.likeRepository.remove(existingLike);
        const likeCount = await this.likeRepository.count({ where: { postId } });
        return { liked: false, likeCount };
      }
  
      if (existingLike.reactType !== reactType) {
        // Update reaction type instead of unliking
        existingLike.reactType = reactType;
        await this.likeRepository.save(existingLike);
      }
    } else {
      if (!unlike) {
        // Like the post if it hasn't been liked yet
        const newLike = this.likeRepository.create({ userId, postId, reactType });
        await this.likeRepository.save(newLike);
      }
    }
  
    // Get the updated like count
    const likeCount = await this.likeRepository.count({ where: { postId } });
  
    this.postLikeGateway.emitLikePost(postId, likeCount);

    if(!unlike)
    {
      this.notificationsService.create(userId, { type: NotificationType.POST_LIKED, recipientUserId: post.userId });
    }

    return { liked: true, likeCount, reactType };
  }

  async getPostLikes(postId: string): Promise<{ likeCount: number; reactions: Record<ReactTypeEnum, number>; users: { id: string; username: string }[] }> {
  // Fetch all likes for the given post, including user details
  const likes = await this.likeRepository.find({
    where: { postId },
    relations: ["user"], // Fetch user details
  });

  // Calculate total like count
  const likeCount = likes.length;

  // Count each reaction type
  const reactions = likes.reduce((acc, like) => {
    acc[like.reactType] = (acc[like.reactType] || 0) + 1;
    return acc;
  }, {} as Record<ReactTypeEnum, number>);

  return {
    likeCount,
    reactions,
    users: likes.map(like => ({
      id: like.user?.id,  // Only return user ID
      profilePicUrl: like.user?.profilePicUrl,
      fullName: like.user?.fullName,
      username: like.user?.username, // Only return user name
      userType: like.user?.userType
    })),
  };
}

  
async isUserLikedPost(postId: string, userId?: string | undefined): Promise<boolean | undefined> {

  if(!userId) return undefined;

  const like = await this.likeRepository.findOne({
    where: {
      postId,
      userId
    }
  });
  return !!like;
}

  

}
