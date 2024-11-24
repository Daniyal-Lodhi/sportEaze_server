import { ArrayNotEmpty, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { PostVisibilityEnum } from 'src/common/enums/user-posts.enum';
import { PostMediaDTO } from './post-media.dto';
import { PostLikesDTO } from './post-likes.dto';
import { CommentDTO } from './post-comments.dto';
import { Type } from 'class-transformer';

export class CreateMediaPostDTO {


  @IsUUID()
  @IsOptional()
  userId: string;

  @IsString()
  @IsNotEmpty()
  textContent: string;

  @IsEnum(PostVisibilityEnum)
  @IsOptional()
  visibility?: PostVisibilityEnum;

  @IsOptional()
  shareCount: number;

  @IsNotEmpty()
  @ArrayNotEmpty()
  @ValidateNested({ each: true }) // Ensures each array element is validated
  @Type(() => PostMediaDTO) // Specifies the type of array elements
  media: PostMediaDTO[];

  @IsOptional()
  likes?: PostLikesDTO[];

  @IsOptional()
  comments?: CommentDTO[];

}
