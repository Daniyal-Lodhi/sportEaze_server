import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserType } from "src/common/enums/user/user-type.enum";
import { Repository, In, Not } from "typeorm";
import { NetworkService } from "../user/network/network.service";
import { SharedPost } from "../user/user-posts/entities/shared-post.entity";
import { UserPost } from "../user/user-posts/entities/user-post.entity";
import { PostLikesService } from "../user/user-posts/post-likes/post-likes.service";
import { UserService } from "../user/user.service";

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(UserPost) private readonly userPostRepo: Repository<UserPost>,
    @InjectRepository(SharedPost) private readonly sharedPostRepo: Repository<SharedPost>,
    private readonly postLikeService: PostLikesService,
    private readonly userService: UserService,
    private readonly networkService: NetworkService,
  ) {}

  async getUserFeed(pageNo: number, pageSize: number, userId?: string): Promise<any> {
    if (!userId) {
      return await this.getDefaultFeed(pageNo, pageSize, userId);
    }

    const userType = await this.userService.getUserType(userId);
    console.log(userType);

    if (userType === UserType.FAN || userType === UserType.MENTOR) {
      console.log("Fetching feed for FAN user");

      const followedPlayers = await this.networkService.getFollowing(userId);
      console.log("Following players:", followedPlayers);

      if (followedPlayers.length > 0) {
        return await this.getFeedFromFollowedPlayers(pageNo, pageSize, followedPlayers, userId);
      } else {
        const sharedPosts = await this.getSharedPostsFromConnections(pageNo, pageSize, userId);
        if (sharedPosts.length > 0) {
          return sharedPosts;
        } else {
          return await this.getDefaultFeed(pageNo, pageSize, userId);
        }
      }
    }

    return await this.getDefaultFeed(pageNo, pageSize, userId);
  }

  private async getFeedFromFollowedPlayers(pageNo: number, pageSize: number, followedPlayers: { id: string }[], userId: string): Promise<any> {
    const followedPosts: any[] = [];

    const followedPostsData = await this.fetchPostsFromUsers(followedPlayers.map(f => f.id), pageNo, pageSize, userId);
    followedPosts.push(...followedPostsData);

    return followedPosts;
  }

  private async getSharedPostsFromConnections(pageNo: number, pageSize: number, userId: string): Promise<any[]> {
    const connections = await this.networkService.getConnections(userId);
    const sharedPostsData = await this.sharedPostRepo.find({
      where: {
        user: {
          id: In(connections.map(c => c.id)),
        } 
      },
      skip: (pageNo - 1) * pageSize,
      take: pageSize,
      relations: ["user", "originalPost", "originalPost.media", "originalPost.likes", "originalPost.comments"],
    });

    console.log("Shared posts from connections:", sharedPostsData);
    return this.sanitizeSharedPosts(sharedPostsData, userId);
  }

  private async fetchPostsFromUsers(userIds: string[], pageNo: number, pageSize: number, userId: string, excludedUsers: { id: string }[] = []): Promise<any[]> {
    const userIdsCondition = userIds.length > 0 ? In(userIds) : Not(In(excludedUsers.map(f => f.id)));

    const posts = await this.userPostRepo.find({
      where: {
        userId: userIdsCondition
      }, 
      skip: (pageNo - 1) * pageSize, 
      take: pageSize, 
      relations: ["media", "user", "likes", "comments"], 
    }); 

    console.log(userIds.length > 0 ? "Followed players' posts:" : "Other players' posts:", posts); 

    return this.sanitizePosts(posts, userId); 
  } 

  private async sanitizePosts(posts: UserPost[], userId: string): Promise<any[]> { 
    return Promise.all( 
      posts.map(async (post) => ({ 
        ...post, 
        userId: undefined, 
        user: { 
          ...post.user, 
          email: undefined, 
          dob: undefined, 
          gender: undefined, 
          sportInterests: undefined, 
          deleted: undefined, 
          createdAt: undefined, 
          updatedAt: undefined, 
        }, 
        likeCount: post.likes?.length || 0, 
        commentCount: post.comments?.length || 0, 
        comments: undefined, 
        likes: undefined, 
        isLiked: await this.postLikeService.isUserLikedPost(post.id, userId), 
      })) 
    ); 
  } 

  private async sanitizeSharedPosts(posts: SharedPost[], userId: string): Promise<any[]> { 
    return Promise.all( 
      posts.map(async (post) => {
        const { likes, comments, ...restOriginalPost } = post.originalPost;
  
        return {
          ...post, 
          userId: undefined, 
          user: { 
            ...post.user, 
            email: undefined, 
            dob: undefined, 
            gender: undefined, 
            sportInterests: undefined, 
            deleted: undefined, 
            createdAt: undefined, 
            updatedAt: undefined, 
          },
          originalPost: {
            ...restOriginalPost,          
            likeCount: likes?.length || 0, 
            commentCount: comments?.length || 0, 
            comments: undefined, 
            likes: undefined, 
            isLiked: await this.postLikeService.isUserLikedPost(post.originalPost.id, userId), 
          },
        };
      }) 
    ); 
  }

  private async getDefaultFeed(pageNo: number, pageSize: number, userId?: string): Promise<any> { 
    const posts = await this.userPostRepo.find({ 
      skip: (pageNo - 1) * pageSize, 
      take: pageSize, 
      relations: ["media", "user", "likes", "comments"], 
    }); 
    return this.sanitizePosts(posts, userId); 
  } 

  private shufflePosts(posts: any[]) { 
    for (let i = posts.length - 1; i > 0; i--) { 
      const j = Math.floor(Math.random() * (i + 1)); 
      [posts[i], posts[j]] = [posts[j], posts[i]]; // Swap elements 
    }
    return posts;
  }
}
