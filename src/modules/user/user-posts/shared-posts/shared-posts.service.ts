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
import { share } from 'rxjs';

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

    this.sharedPostRepository.save(sharedPost);

    return {
        ...sharedPost,
        user: undefined,
        originalPost: {
            ...sharedPost.originalPost,
            likes: undefined,
        }
    }
  }

  async getSharedPostsById(id: string): Promise<SharedPost> {
    const sharedPost = await this.sharedPostRepository.findOne({
      where: { id },
      relations: ["originalPost"],
    });
    if (!sharedPost) {
      throw new NotFoundException("Shared post not found");
    }
  
    // Retrieve the original post (which is of type GetPostDTO)
    const originalPostDTO = await this.postSrv.getPostById(sharedPost.originalPost.id);
  
    // Create a shallow copy and cast it as any so you can remove properties
    const originalPost = { ...originalPostDTO } as any;
    originalPost.likes = undefined;
    originalPost.reactions = undefined;
  
    // Assign the modified originalPost back to sharedPost
    sharedPost.originalPost = originalPost;
    return sharedPost;
  }
  
  async getSharedPostsByUserId(userId: string): Promise<SharedPost[]> {
    await this.userSrv.getUser(userId);
    const sharedPosts = await this.sharedPostRepository.find({
      where: { user: { id: userId } },
      relations: ["originalPost"],
    });
    
    const updatedSharedPosts = await Promise.all(
      sharedPosts.map(async (sharedPost) => {
        if (sharedPost.originalPost) {
          const originalPostDTO = await this.postSrv.getPostById(sharedPost.originalPost.id);
          const originalPost = { ...originalPostDTO } as any;
          originalPost.likes = undefined;
          originalPost.reactions = undefined;
          sharedPost.originalPost = originalPost;
        }
        return sharedPost;
      })
    );
    
    return updatedSharedPosts;
  }
    

  async UpdateSharedPost(userId: string, sharedPostId: string, updateSharedPost: UpdateSharedPostDto): Promise<SharedPost> {
    await this.userSrv.getUser(userId); // Ensure the user exists

    const sharedPost = await this.getSharedPostsById(sharedPostId);
    
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
