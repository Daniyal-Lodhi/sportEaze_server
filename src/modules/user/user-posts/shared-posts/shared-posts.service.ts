import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSharedPostDto } from './dto/create-shared-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '../../user.service';
import { GetUserDto } from '../../dto/get-user.dto';
import { UserPostService } from '../user-post.service';
import { GetPostDTO } from '../dto/get-post.dto';
import { SharedPost } from '../entities/shared-post.entity';
import { Repository } from 'typeorm';
import { PostVisibilityEnum, ReactTypeEnum } from 'src/common/enums/user-posts.enum';
import { UserPost } from '../entities/user-post.entity';
import { UpdateSharedPostDto } from './dto/update-shared-post.dto';

@Injectable()
export class SharedPostsService {
  constructor(private readonly userSrv: UserService, private readonly postSrv: UserPostService, @InjectRepository(SharedPost)
      private readonly sharedPostRepository: Repository<SharedPost>, @InjectRepository(UserPost) private readonly postRepository) {}

  async create(userId:string, createSharedPostDto: CreateSharedPostDto): Promise<SharedPost> {

    const user: GetUserDto = await this.userSrv.getUser(userId);  

    const post: GetPostDTO = await this.postSrv.getPostById(createSharedPostDto.originalPostId);

    post.shareCount = (post.shareCount || 0) + 1;
    await this.postRepository.save(post);

    const sharedPost = this.sharedPostRepository.create({
      user, 
      originalPost: post,
      visibility: PostVisibilityEnum.PUBLIC,
      shareMessage: createSharedPostDto.shareMessage,
    });

    return this.sharedPostRepository.save(sharedPost);
  }

  async getSharedPostsByUserId(userId: string): Promise<SharedPost[]> {
    const sharedPosts = await this.sharedPostRepository.find({
        where: { user: { id: userId } },
        relations: [
            "user",
            "originalPost",
            "originalPost.user",
            "originalPost.media",
            "originalPost.likes",
        ],
    });

    return sharedPosts.map((sharedPost) => {
        if (!sharedPost.originalPost) return sharedPost;

        const likeCount = sharedPost.originalPost.likes.length;
        const reactions: Partial<Record<ReactTypeEnum, number>> = {};

        sharedPost.originalPost.likes.forEach((like) => {
            const reactionType = like.reactType;
            reactions[reactionType] = (reactions[reactionType] || 0) + 1;
        });

        return {
            ...sharedPost,
            originalPost: {
                ...sharedPost.originalPost,
                likeCount,
                reactions,
            },
        };
    });
  }

  async getSharedPostsById(id: string): Promise<SharedPost> {
    const sharedPost = await this.sharedPostRepository.findOne({
        where: { id },
        relations: [
            "user",
            "originalPost",
            "originalPost.user",
            "originalPost.media",
            "originalPost.likes",
        ],
    });

    if (!sharedPost) {
        throw new Error("Shared post not found");
    }

    if (sharedPost.originalPost) {
        const likeCount = sharedPost.originalPost.likes.length;
        const reactions: Partial<Record<ReactTypeEnum, number>> = {};

        sharedPost.originalPost.likes.forEach((like) => {
            const reactionType = like.reactType;
            reactions[reactionType] = (reactions[reactionType] || 0) + 1;
        });

        // Assign additional fields dynamically
        (sharedPost.originalPost as any).likeCount = likeCount;
        (sharedPost.originalPost as any).reactions = reactions;
    }

    return sharedPost;
}

  async UpdateSharedPost(userId: string, updateSharedPost: UpdateSharedPostDto): Promise<SharedPost> {
    await this.userSrv.getUser(userId); // Ensure the user exists

    const sharedPost = await this.getSharedPostsById(updateSharedPost.SharedPostId);
    
    if (!sharedPost) {
        throw new Error("Shared post not found");
    }

    // Update fields if provided in DTO
    if (updateSharedPost.shareMessage !== undefined) {
        sharedPost.shareMessage = updateSharedPost.shareMessage;
    }

    return this.sharedPostRepository.save(sharedPost);
  }

}
