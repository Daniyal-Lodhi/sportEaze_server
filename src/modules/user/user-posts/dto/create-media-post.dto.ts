import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  ArrayNotEmpty,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { PostVisibilityEnum } from "src/common/enums/user-posts.enum";
import { PostMediaDTO } from "./post-media.dto";
import { PostLikesDTO } from "./post-likes.dto";
import { CommentDTO } from "./post-comments.dto";
import { Type } from "class-transformer";

export class CreateMediaPostDTO {
  @ApiProperty({
    description: "The text content of the post",
    example: "This is a sample post",
  })
  @IsString()
  @IsNotEmpty()
  textContent: string;

  @ApiPropertyOptional({
    description: "The visibility of the post",
    enum: PostVisibilityEnum,
    example: PostVisibilityEnum.PUBLIC,
  })
  @IsEnum(PostVisibilityEnum)
  @IsOptional()
  visibility?: PostVisibilityEnum;

  @ApiPropertyOptional({
    description: "The number of times the post has been shared",
    example: 10,
  })
  @IsOptional()
  shareCount: number;

  @ApiProperty({
    description: "The media attachments of the post",
    type: [PostMediaDTO],
  })
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
