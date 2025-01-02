import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateTextPostDTO } from "./dto/create-text-post.dto";
import { UserPost } from "./entities/user-post.entity";
import { PostMedia } from "./entities/post-media.entity";
import { CreateMediaPostDTO } from "./dto/create-media-post.dto";
import { GetPostDTO } from "./dto/get-post.dto";
import { UserService } from "../user.service";

@Injectable()
export class UserPostService {
  constructor(
    @InjectRepository(UserPost)
    private readonly postRepository: Repository<UserPost>,
    @InjectRepository(PostMedia)
    private readonly postMediaRepository: Repository<PostMedia>,
    private readonly userSrv: UserService,
  ) {}
  async createTextPost(
    userId: string,
    createTextPost: CreateTextPostDTO,
  ): Promise<CreateTextPostDTO> {
    await this.userSrv.getUser(userId);

    const post = this.postRepository.create({
      ...createTextPost,
      userId,
    });

    const createdPost = await this.postRepository.save(post);
    console.log(createdPost);

    return createdPost;
  }

  async createMediaPost(
    userId: string,
    CreateMediaPostDTO: CreateMediaPostDTO,
  ): Promise<CreateMediaPostDTO> {
    await this.userSrv.getUser(userId);

    const { media, ...CreateMediaPostDTOWoMedia } = CreateMediaPostDTO;

    const post = this.postRepository.create({
      ...CreateMediaPostDTOWoMedia,
      userId,
    });

    const savedPost = await this.postRepository.save(post); // Save the post to the database

    const postMediaEntities = media.map((mediaItem) => {
      return this.postMediaRepository.create({
        ...mediaItem,
        postId: savedPost.id,
      });
    });

    const savedMedia = await this.postMediaRepository.save(postMediaEntities);
    const savedPostWithMedia = { ...savedPost, media: savedMedia };

    return savedPostWithMedia;
  }

  async getPost(userId: string): Promise<GetPostDTO[]> {
    await this.userSrv.getUser(userId);

    console.log(userId);
    const post = await this.postRepository.find({
      where: {
        userId,
      },
      relations: [
        "media",
        // "likes",
        // "comments",
      ],
    });

    console.log(post);

    return post as GetPostDTO[];
  }

  async getPostById(id: string): Promise<GetPostDTO> {
    const post = await this.postRepository.findOne({
      where: {
        id,
      },
      relations: [
        "media",
        // "likes",
        // "comments",
      ],
    });

    console.log(post);

    return post as GetPostDTO;
  }
}
