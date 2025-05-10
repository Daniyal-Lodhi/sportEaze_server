import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  ArrayNotEmpty,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { PostTypeEnum, PostVisibilityEnum } from "src/common/enums/post/user-posts.enum";
import { PostMediaDTO } from "./post-media.dto";
import { Type } from "class-transformer";
import { ContractDetailsDTO } from "./contract-details.dto";

export class CreateMediaPostDTO extends ContractDetailsDTO {
  @ApiProperty({
    description: "The text content of the post",
    example: "This is a sample post",
  })
  @IsString()
  @IsNotEmpty()
  textContent: string;


  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  postType:PostTypeEnum  = PostTypeEnum.MEDIA; 

  @ApiPropertyOptional({
    description: "The visibility of the post", 
    enum: PostVisibilityEnum,
    example: PostVisibilityEnum.PUBLIC,
  })
  @IsEnum(PostVisibilityEnum)
  @IsOptional()
  visibility?: PostVisibilityEnum;

  @ApiProperty({
    description: "The media attachments of the post",
    type: [PostMediaDTO],
  })
  @IsNotEmpty()
  @ArrayNotEmpty()
  @ValidateNested({ each: true }) // Ensures each array element is validated
  @Type(() => PostMediaDTO) // Specifies the type of array elements
  media: PostMediaDTO[];
}
