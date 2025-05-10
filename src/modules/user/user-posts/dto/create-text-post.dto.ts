import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { PostTypeEnum, PostVisibilityEnum } from "src/common/enums/post/user-posts.enum";
import { PostLikesDTO } from "./post-likes.dto";
import { CommentDTO } from "./post-comments.dto";
import { ContractDetailsDTO } from "./contract-details.dto";

export class CreateTextPostDTO extends ContractDetailsDTO {
  @ApiProperty({
    description: "The text content of the post",
    example: "This is an example text post.",
  })
  @IsString()
  @IsNotEmpty()
  textContent: string;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  postType: PostTypeEnum  = PostTypeEnum.TEXT; 

  @ApiPropertyOptional({
    description: "The visibility setting for the post",
    enum: PostVisibilityEnum,
    example: PostVisibilityEnum.PRIVATE,
  })
  @IsEnum(PostVisibilityEnum)
  @IsOptional()
  visibility?: PostVisibilityEnum;
}
