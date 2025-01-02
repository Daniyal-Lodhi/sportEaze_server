import { ApiProperty } from "@nestjs/swagger";
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  MinLength,
} from "class-validator";
import { MediaType } from "src/common/enums/user-posts.enum"; // Enum for MediaType

export class PostMediaDTO {
  @ApiProperty({
    description: "The type of media being attached to the post",
    enum: MediaType,
    example: MediaType.IMG, // Replace with an actual enum value
  })
  @IsEnum(MediaType)
  @IsNotEmpty()
  mediaType: MediaType;

  @ApiProperty({
    description: "The order of the media in the post",
    example: 1,
  })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  mediaOrder: number;

  @ApiProperty({
    description: "The link or URL to the media file",
    example: "https://example.com/media/image.jpg",
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  mediaLink: string;
}
