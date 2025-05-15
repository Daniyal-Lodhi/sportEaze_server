import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserType } from "src/common/enums/user/user-type.enum";
import { Repository, In, Not } from "typeorm";
import { NetworkService } from "../user/network/network.service";
import { SharedPost } from "../user/user-posts/entities/shared-post.entity";
import { UserPost } from "../user/user-posts/entities/user-post.entity";
import { PostLikesService } from "../user/user-posts/post-likes/post-likes.service";
import { UserService } from "../user/user.service";
import { PostTypeEnum } from "src/common/enums/post/user-posts.enum";
import { Contract } from "../contracts/entities/contract.entity";

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(UserPost) private readonly userPostRepo: Repository<UserPost>,
    @InjectRepository(SharedPost) private readonly sharedPostRepo: Repository<SharedPost>,
    @InjectRepository(Contract) private readonly contractRepository: Repository<Contract>,
    private readonly postLikeService: PostLikesService,
    private readonly userService: UserService,
    private readonly networkService: NetworkService,
  ) {}

async getUserFeed(pageNo: number, pageSize: number, userId?: string): Promise<any> {
  if (!userId) return await this.getDefaultFeed(pageNo, pageSize);

  const userType = await this.userService.getUserType(userId);

  if (userType === UserType.FAN || userType === UserType.MENTOR || userType === UserType.PATRON) {
    const followedPlayers = await this.networkService.getFollowing(userId);
    const followedPlayerIds = followedPlayers.map(f => f.id);

    const followedPosts = await this.fetchPostsFromUsers(followedPlayerIds, pageNo, pageSize, userId);
    let totalPosts = [...followedPosts];

    if (totalPosts.length < pageSize) {
      const remaining = pageSize - totalPosts.length;
      const sharedPosts = await this.getSharedPostsFromConnections(pageNo, remaining, userId);
      totalPosts.push(...sharedPosts);
    }

    if (totalPosts.length < pageSize) {
      const remaining = pageSize - totalPosts.length;
      const defaultPosts = await this.fetchPostsFromUsers([], pageNo, remaining, userId, followedPlayers);
      totalPosts.push(...defaultPosts);
    }

    console.log(totalPosts);
    
    // Sort by likes > comments > shares
const nonSharedPosts = totalPosts
  .filter(post => post.postType !== PostTypeEnum.SHARED)
  .sort((a, b) => {
    const likeDiff = (b.likeCount || 0) - (a.likeCount || 0);
    if (likeDiff !== 0) return likeDiff;

    const commentDiff = (b.commentCount || 0) - (a.commentCount || 0);
    if (commentDiff !== 0) return commentDiff;

    return (b.shareCount || 0) - (a.shareCount || 0);
  });

const sharedPosts = totalPosts
  .filter(post => post.postType === PostTypeEnum.SHARED)
  .sort((a, b) => {
    const likeDiff = (b.likeCount || 0) - (a.likeCount || 0);
    if (likeDiff !== 0) return likeDiff;

    const commentDiff = (b.commentCount || 0) - (a.commentCount || 0);
    if (commentDiff !== 0) return commentDiff;

    return (b.shareCount || 0) - (a.shareCount || 0);
  });

return [...nonSharedPosts, ...sharedPosts];

  }
else if (userType === UserType.PLAYER) {
  const followers = await this.networkService.getFollowers(userId);
  const followerIds = followers.map(f => f.id);

  const sharedPosts = await this.getSharedFromFollowers(pageNo, pageSize, userId,);

  let totalPosts = [...sharedPosts];

  // Get player's primary and secondary sports
  const player = await this.userService.getUser(userId);
  const primarySport = player.primarySport;
  const secondarySports = player.secondarySports || [];

  // Get posts from other players with same primary sport
  if (totalPosts.length < pageSize) {
    const remaining = pageSize - totalPosts.length;

    const samePrimaryPlayers = await this.userService.getUsersBySport(primarySport, userId);
    const primaryPosts = await this.fetchPostsFromUsers(
      samePrimaryPlayers.map(p => p.id),
      1,
      remaining,
      userId
    );

    totalPosts.push(...primaryPosts);
  }

  // Get posts from players with matching secondary sports
  if (totalPosts.length < pageSize && secondarySports.length > 0) {
    const remaining = pageSize - totalPosts.length;

    const sameSecondaryPlayers = await this.userService.getUsersBySecondarySports(secondarySports, userId);
    const secondaryPosts = await this.fetchPostsFromUsers(
      sameSecondaryPlayers.map(p => p.id),
      1,
      remaining,
      userId
    );

    totalPosts.push(...secondaryPosts);
  }

      if (totalPosts.length < pageSize) {
      const remaining = pageSize - totalPosts.length;
      const defaultPosts = await this.fetchPostsFromUsers([], 1, remaining, userId, []);
      totalPosts.push(...defaultPosts);
      }

  // Sort all posts: likes > comments > shares
  const nonSharedPosts = totalPosts
    .filter(post => post.postType !== PostTypeEnum.SHARED)
    .sort((a, b) => {
      const likeDiff = (b.likeCount || 0) - (a.likeCount || 0);
      if (likeDiff !== 0) return likeDiff;

      const commentDiff = (b.commentCount || 0) - (a.commentCount || 0);
      if (commentDiff !== 0) return commentDiff;

      return (b.shareCount || 0) - (a.shareCount || 0);
    });

  const shared = totalPosts
    .filter(post => post.postType === PostTypeEnum.SHARED)
    .sort((a, b) => {
      const likeDiff = (b.likeCount || 0) - (a.likeCount || 0);
      if (likeDiff !== 0) return likeDiff;

      const commentDiff = (b.commentCount || 0) - (a.commentCount || 0);
      if (commentDiff !== 0) return commentDiff;

      return (b.shareCount || 0) - (a.shareCount || 0);
    });

  return [...shared, ...nonSharedPosts];
}


  return await this.getDefaultFeed(pageNo, pageSize, userId);
}

  private async getSharedFromFollowers(pageNo: number, pageSize: number, userId: string): Promise<any[]> {
    const follwers = await this.networkService.getFollowers(userId);
    const sharedPostsData = await this.sharedPostRepo.find({
      where: {
        user: {
          id: In(follwers.map(c => c.id)),
        } 
      },
      skip: (pageNo - 1) * pageSize,
      take: pageSize,
      relations: ["user", "originalPost", "originalPost.media", "originalPost.likes", "originalPost.comments", "originalPost.user"],
    });

    return this.sanitizeSharedPosts(sharedPostsData, userId);
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
      relations: ["user", "originalPost", "originalPost.media", "originalPost.likes", "originalPost.comments", "originalPost.user"],
    });

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

    return this.sanitizePosts(posts, userId); 
  } 

  private async sanitizePosts(posts: UserPost[], userId: string): Promise<any[]> { 
    return Promise.all( 
      posts.map(async (post) => {
        
        let patron = undefined;

        if(post.postType == PostTypeEnum.CONTRACT) {
          const contract = await this.contractRepository.findOne({
            where: { id: post.contractId },
            relations: ["patron", "patron.user"],
          });
          
          patron = {
            id: contract.patron.id,
            profilePicUrl: contract.patron.user.profilePicUrl,
            fullName: contract.patron.user.fullName,
            username: contract.patron.user.username,
          }
        }

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
          patron, 
          likeCount: post.likes?.length || 0, 
          commentCount: post.comments?.length || 0, 
          comments: undefined, 
          likes: undefined, 
          isLiked: await this.postLikeService.isUserLikedPost(post.id, userId), 
        }
      })
    ); 
  } 

  private async sanitizeSharedPosts(posts: SharedPost[], userId: string): Promise<any[]> { 
    return Promise.all( 
      posts.map(async (post) => {
        const { likes, comments, ...restOriginalPost } = post.originalPost;
  
        let patron = undefined;

        if(restOriginalPost.postType == PostTypeEnum.CONTRACT) {
          const contract = await this.contractRepository.findOne({
            where: { id: restOriginalPost.contractId },
            relations: ["patron", "patron.user"],
          });
          
          patron = {
            id: contract.patron.id,
            profilePicUrl: contract.patron.user.profilePicUrl,
            fullName: contract.patron.user.fullName,
            username: contract.patron.user.username,
          }
        }

        return {
          sharedId: post.id,
          id: restOriginalPost.id,
          textContent: restOriginalPost.textContent,
          visibility: restOriginalPost.visibility,
          shareCount: restOriginalPost.shareCount,
          postType: PostTypeEnum.SHARED,
          createdAt: restOriginalPost.createdAt,
          updatedAt: restOriginalPost.updatedAt,
          media: restOriginalPost.media,
          user: {
            id: restOriginalPost.user?.id,
            profilePicUrl: restOriginalPost.user?.profilePicUrl,
            fullName: restOriginalPost.user?.fullName,
            username: restOriginalPost.user?.username,
            userType: restOriginalPost.user?.userType,
          },
          patron,
          likeCount: likes?.length || 0,
          commentCount: comments?.length || 0,
          isLiked: await this.postLikeService.isUserLikedPost(post.originalPost.id, userId),           
          share: {
            message: post.shareMessage,
            user: {
              id: post.user?.id,
              profilePicUrl: post.user?.profilePicUrl,
              fullName: post.user?.fullName,
              username: post.user?.username,
              userType: post.user?.userType,
            }
          }
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

  const sanitizedPosts = await this.sanitizePosts(posts, userId);

  // Sort by likes > comments > shares
  return sanitizedPosts.sort((a, b) => {
    const likeDiff = (b.likeCount || 0) - (a.likeCount || 0);
    if (likeDiff !== 0) return likeDiff;

    const commentDiff = (b.commentCount || 0) - (a.commentCount || 0);
    if (commentDiff !== 0) return commentDiff;

    return (b.shareCount || 0) - (a.shareCount || 0);
  });
}

}
