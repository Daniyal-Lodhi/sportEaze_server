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
import { PostCategoryEnum, MediaType } from "src/common/enums/post/user-posts.enum";
import { Sport } from "src/common/enums/sport/sport.enum";

export class SponsoredPostTargetSportDTO {
    @ApiProperty({ enum: Sport, example: Sport.FOOTBALL })
    @IsEnum(Sport)
    sport: Sport;
  }