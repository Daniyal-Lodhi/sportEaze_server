import { PostVisibilityEnum } from 'src/common/enums/user-posts.enum';
import { PostMediaDTO } from './post-media.dto';
import { PostLikesDTO } from './post-likes.dto';
import { CommentDTO } from './post-comments.dto';
import { IsNumber, isString, IsString, IsUUID } from 'class-validator';

export class GetPostDTO {
  @IsString()
  textContent: string;

  visibility?: PostVisibilityEnum;

  @IsNumber()
  shareCount: number;

  media: PostMediaDTO[];

  likes?: PostLikesDTO[];

  comments?: CommentDTO[];
}
