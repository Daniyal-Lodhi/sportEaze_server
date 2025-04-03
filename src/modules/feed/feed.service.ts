import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SharedPost } from "../user/user-posts/entities/shared-post.entity";
import { UserPost } from "../user/user-posts/entities/user-post.entity";
import { GetUserDto } from "../user/dto/get-user.dto";
import { GetPostDTO } from "../user/user-posts/dto/get-post.dto";
import { PostLikesService } from "../user/user-posts/post-likes/post-likes.service";

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(UserPost) private readonly userPostRepo: Repository<UserPost>,
    @InjectRepository(SharedPost) private readonly sharedPostRepo: Repository<SharedPost>,
    private readonly postLikeService: PostLikesService,
  ) {}

  async getNewsFeed(pageNo: number, pageSize: number, userId?: string | undefined): Promise<any> {

    const count = Math.floor(pageSize / 2);

    const userPosts = await this.userPostRepo.find({
      skip: (pageNo - 1) * count,
      take: count,
      relations: ["media", "user", "likes", "comments"]
    });

    const sanitizedPosts = await Promise.all(
      userPosts.map(async (post) => ({
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
          updatedAt: undefined
        },
        likesCount: post.likes?.length || 0,
        commentsCount: post.comments?.length || 0,
        comments: undefined,
        likes: undefined,
        isLiked: await this.postLikeService.isUserLikedPost(post.id, userId)
      }))
    );
    return this.shuffleArray(sanitizedPosts);
  }

   // Fisher-Yates Shuffle Algorithm for randomness 
   private shuffleArray(array: any[]){ 
    for (let i = array.length - 1; i > 0; i--) { 
      const j = Math.floor(Math.random() * (i + 1)); 
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements 
    }
    return array;
  }
}