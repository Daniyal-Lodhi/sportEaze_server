import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateTextPostDTO } from "./dto/create-text-post.dto";
import { UserPost } from "./entities/user-post.entity";
import { PostMedia } from "./entities/post-media.entity";
import { CreateMediaPostDTO } from "./dto/create-media-post.dto";
import { GetPostDTO } from "./dto/get-post.dto";
import { UserService } from "../user.service";
import { GetUserDto } from "../dto/get-user.dto";
import { UserType } from "src/common/enums/user/user-type.enum";
import { PostTypeEnum, ReactTypeEnum } from "src/common/enums/post/user-posts.enum";
import { PostLikesService } from "./post-likes/post-likes.service";
import { SharedPost } from "./entities/shared-post.entity";

@Injectable()
export class UserPostService {
  constructor(
    @InjectRepository(UserPost) private readonly postRepository: Repository<UserPost>,
    @InjectRepository(PostMedia) private readonly postMediaRepository: Repository<PostMedia>,
    @InjectRepository(SharedPost) private readonly sharedPostRepository: Repository<SharedPost>,
    private readonly userSrv: UserService,
    private readonly postLikeService: PostLikesService,
  ) {}
  async createTextPost(
    userId: string,
    createTextPost: CreateTextPostDTO,
  ): Promise<CreateTextPostDTO> {
    const user:GetUserDto = await this.userSrv.getUser(userId);

    if(user.userType !== UserType.PLAYER && user.userType !== UserType.MENTOR ){
      throw new Error("Only Player and Mentor can create post");
    }

    const post = this.postRepository.create({
      ...createTextPost,
      userId,
      postType: PostTypeEnum.TEXT,
    });


    const createdPost:CreateTextPostDTO = await this.postRepository.save(post);
    console.log(createdPost);

    return createdPost;
  }

  async createMediaPost(
    userId: string,
    CreateMediaPostDTO: CreateMediaPostDTO,
  ): Promise<CreateMediaPostDTO> {
    const user:GetUserDto  = await this.userSrv.getUser(userId);
    if(user.userType !== UserType.PLAYER && user.userType !== UserType.MENTOR ){
      throw new Error("Only Player and Mentor can create post");
    }

    const { media, ...CreateMediaPostDTOWoMedia } = CreateMediaPostDTO;

    const post = this.postRepository.create({
      ...CreateMediaPostDTOWoMedia,
      userId,
      postType: PostTypeEnum.MEDIA,
    });

    const savedPost = await this.postRepository.save(post); // Save the post to the database

    const postMediaEntities = media.map((mediaItem) => {
      return this.postMediaRepository.create({
        ...mediaItem,
        postId: savedPost.id,
      });
    });

    const savedMedia = await this.postMediaRepository.save(postMediaEntities);
    const savedPostWithMedia:CreateMediaPostDTO= { ...savedPost, media: savedMedia };

    return savedPostWithMedia;
  }

  async getPosts(
    userId: string,
    pageSize: number,
    pageNo: number
  ): Promise<{ totalPosts: number; currentPage: number; totalPages: number; posts: any[] }> {
    await this.userSrv.getUser(userId);
  
    console.log(`Fetching posts for user: ${userId}, Page: ${pageNo}, Page Size: ${pageSize}`);
  
    const [posts, totalPosts] = await this.postRepository.findAndCount({
      where: { userId },
      relations: ["media", "likes", "comments"],
      order: { createdAt: "DESC" }, // ✅ Fetch latest posts first
      skip: (pageNo - 1) * pageSize, // ✅ Pagination logic
      take: pageSize,
    });
  
    console.log(`Total Posts Found: ${totalPosts}, Returned Posts: ${posts.length}`);
  
    return {
      totalPosts, // ✅ Total number of posts
      currentPage: pageNo,
      totalPages: Math.ceil(totalPosts / pageSize),
      posts: posts.map(({ id, textContent, visibility, shareCount, media, likes, comments }) => ({
        id,
        textContent,
        visibility,
        shareCount,
        media,
        likeCount: likes?.length || 0, // ✅ Total number of likes
        commentCount: comments?.length || 0, // ✅ Total number of comments
        reactions: likes?.reduce((acc, { reactType }) => {
          acc[reactType] = (acc[reactType] || 0) + 1;
          return acc;
        }, {} as Record<ReactTypeEnum, number>), // ✅ Reaction breakdown
      })),
    };
  }

  async getPostById(id: string, userId?: string | undefined): Promise<GetPostDTO> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ["media", "likes", "user", 'comments'], // ✅ Include "comments" in relations
    });
  
    if (!post) {
      throw new Error("Post not found");
    }
  
    // Calculate like count and reaction breakdown
    const likeCount = post.likes.length;
    const reactions: Partial<Record<ReactTypeEnum, number>> = {};
  
    post.likes.forEach((like) => {
      const reactionType = like.reactType;
      reactions[reactionType] = (reactions[reactionType] || 0) + 1;
    });
  
    // ✅ Get comment count directly from the post object
    const commentCount = post.comments.length;
    post.comments = undefined;
    post.likes = undefined;

    post.user = { ...post.user, email: undefined, dob: undefined, gender: undefined, sportInterests: undefined, deleted: undefined, createdAt: undefined, updatedAt: undefined };

    const isLiked: boolean | undefined = await this.postLikeService.isUserLikedPost(id, userId);
    
    return {
      ...post,
      likeCount,
      reactions,
      commentCount, // ✅ Included comment count
      isLiked
    };
  }

  async getUserPostCount(userId: string): Promise<number> {
    return await this.postRepository.count({ where: { userId } });
  }

  async getShares(postId: string)
  {
    const users = await this.sharedPostRepository.find({
      where: { originalPost: { id: postId } },
      relations: ["user"],
      select: ["user"],
    });
    
    return users.map((user) => {
      return {
        id: user.user.id,
        profilePicUrl: user.user.profilePicUrl,
        fullName: user.user.fullName,
        username: user.user.username,
        userType: user.user.userType,
      };
    })
  }
}
