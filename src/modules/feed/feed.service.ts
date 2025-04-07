import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SharedPost } from "../user/user-posts/entities/shared-post.entity";
import { UserPost } from "../user/user-posts/entities/user-post.entity";
import { PostLikesService } from "../user/user-posts/post-likes/post-likes.service";
import { UserService } from "../user/user.service";
import { NetworkService } from "../user/network/network.service";
import { UserType } from "src/common/enums/user/user-type.enum";
import { Not, In } from 'typeorm';

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
    if (userId) {
      const userType = await this.userService.getUserType(userId);
      console.log(userType);

      if (userType === UserType.FAN) {
        console.log("Fetching feed for FAN user");

        // Fetch the list of followed players
        const followedPlayers = await this.networkService.getFollowing(userId);
        console.log("Following players:", followedPlayers);

        if (followedPlayers.length === 0) {
          // If the user is not following anyone, return the default feed
          return await this.getDefaultFeed(pageNo, pageSize, userId);
        }

        // Get the feed from followed players first, then from other players
        return await this.getFeedFromFollowedPlayersAndOthers(pageNo, pageSize, followedPlayers, userId);
      }
    }

    // Return the default feed if no userId is provided or if not a FAN
    return await this.getDefaultFeed(pageNo, pageSize, userId);
  }

  private async getFeedFromFollowedPlayersAndOthers(pageNo: number, pageSize: number, followedPlayers: { id: string }[], userId: string): Promise<any> {
    const countPerCategory = Math.floor(pageSize / 2); // Split feed between followed and other players
    const followedPosts: any[] = [];
    const otherPosts: any[] = [];

    // Fetch posts from followed players first
    const followedPostsData = await this.fetchPostsFromUsers(followedPlayers.map(f => f.id), pageNo, countPerCategory, userId);
    followedPosts.push(...followedPostsData);

    // Fetch posts from other players (not followed)
    const otherPostsData = await this.fetchPostsFromUsers([], pageNo, countPerCategory, userId, followedPlayers);
    otherPosts.push(...otherPostsData);

    // Shuffle the followed posts and other posts separately
    return this.mergeAndShufflePosts(followedPosts, otherPosts);
  }

  private async fetchPostsFromUsers(userIds: string[], pageNo: number, countPerPage: number, userId: string, excludedUsers: { id: string }[] = []): Promise<any[]> {
    const userIdsCondition = userIds.length > 0 ? In(userIds) : Not(In(excludedUsers.map(f => f.id)));

    const posts = await this.userPostRepo.find({
      where: {
        userId: userIdsCondition
      },
      skip: (pageNo - 1) * countPerPage,
      take: countPerPage,
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

  private async getDefaultFeed(pageNo: number, pageSize: number, userId?: string): Promise<any> {
    // const countPerPage = Math.floor(pageSize / 2);

    const posts = await this.userPostRepo.find({
      skip: (pageNo - 1) * pageSize,
      take: pageSize,
      relations: ["media", "user", "likes", "comments"],
    });

    return this.sanitizePosts(posts, userId);
  }

  // Merge and shuffle the posts from followed and non-followed users
  private mergeAndShufflePosts(followedPosts: any[], otherPosts: any[]): any[] {
    // Shuffle followed posts and other posts separately
    const shuffledFollowedPosts = this.shufflePosts(followedPosts);
    const shuffledOtherPosts = this.shufflePosts(otherPosts);

    // Merge followed and other posts
    return [...shuffledFollowedPosts, ...shuffledOtherPosts];
  }

  private shufflePosts(posts: any[]) {
    for (let i = posts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [posts[i], posts[j]] = [posts[j], posts[i]]; // Swap elements
    }
    return posts;
  }
}