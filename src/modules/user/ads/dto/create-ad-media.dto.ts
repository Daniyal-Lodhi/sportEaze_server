import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsUrl,
  IsEnum,
  IsUUID,
  IsInt,
  IsOptional,
  ValidateNested,
  ArrayNotEmpty,
  IsArray,
  Length,
} from "class-validator";
import { Type } from "class-transformer";
import { MediaType } from "src/common/enums/post/user-posts.enum";
import { Sport } from "src/common/enums/sport/sport.enum";

export class SponsoredPostMediaDTO {
  @ApiProperty({ example: 0 })
  @IsEnum(MediaType)
  mediaType: MediaType;

  @ApiProperty({ example: "https://example.com/media/image1.jpg" })
  @IsUrl()
  mediaLink: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  mediaOrder: number;

  @ApiProperty({ example: "https://example.com/media/thumb1.jpg" })
  @IsString()
  @IsNotEmpty()
  mediaThumbnail: string;
  }


  
  