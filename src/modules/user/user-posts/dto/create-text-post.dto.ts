import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { PostVisibilityEnum } from "src/common/enums/user-posts.enum";
import { PostLikesDTO } from "./post-likes.dto";
import { CommentDTO } from "./post-comments.dto";

export class CreateTextPostDTO {
  @ApiProperty({
    description: "The text content of the post",
    example: "This is an example text post.",
  })
  @IsString()
  @IsNotEmpty()
  textContent: string;

  @ApiPropertyOptional({
    description: "The visibility setting for the post",
    enum: PostVisibilityEnum,
    example: PostVisibilityEnum.PRIVATE,
  })
  @IsEnum(PostVisibilityEnum)
  @IsOptional()
  visibility?: PostVisibilityEnum;

  @IsOptional()
  shareCount: number;

  @IsOptional()
  likes?: PostLikesDTO[];

  @IsOptional()
  comments?: CommentDTO[];
}
