import { ApiPropertyOptional, ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, IsUUID, Length, IsArray, IsUrl } from "class-validator";
import { Sport } from "src/common/enums/sport.enum";
import { PlayingLevel } from "src/common/enums/playing-levels.enum";

export class UpdatePlayerDto {
  
  @ApiPropertyOptional({ description: "Primary sport", example: Sport.FOOTBALL })
  @IsEnum(Sport)
  @IsOptional()
  primarySport?: Sport;

  @ApiPropertyOptional({ description: "Secondary sports", example: [Sport.CRICKET, Sport.HOCKEY] })
  @IsArray()
  @IsEnum(Sport, { each: true })
  @IsOptional()
  secondaySports?: Sport[];

  @ApiPropertyOptional({ description: "Playing level", example: PlayingLevel.PROFESIONAL })
  @IsEnum(PlayingLevel)
  @IsOptional()
  playingLevel?: PlayingLevel;

  @ApiPropertyOptional({ description: "Rank between 1 and 100", example: 5 })
  @IsInt()
  @IsOptional()
  rank?: number;

  @ApiPropertyOptional({ description: "Region name", example: "North", maxLength: 25 })
  @IsString()
  @IsOptional()
  @Length(1, 25)
  region?: string;

  @ApiPropertyOptional({ description: "Club name", example: "Chess Club", maxLength: 25 })
  @IsString()
  @IsOptional()
  @Length(1, 25)
  club?: string;

  @ApiPropertyOptional({ description: "Coach name", example: "John Doe" })
  @IsString()
  @IsOptional()
  coachName?: string;

  @ApiPropertyOptional({ description: "Facebook link", example: "https://facebook.com/player" })
  @IsUrl()
  @IsOptional()
  FB_link?: string;

  @ApiPropertyOptional({ description: "Instagram link", example: "https://instagram.com/player" })
  @IsUrl()
  @IsOptional()
  INSTA_link?: string;

  @ApiPropertyOptional({ description: "Twitter link", example: "https://x.com/player" })
  @IsUrl()
  @IsOptional()
  X_link?: string;

  @ApiPropertyOptional({ description: "Short bio or description about the player", example: "Passionate about sports.", maxLength: 200 })
  @IsString()
  @IsOptional()
  @Length(1, 200)
  bio?: string;

  @ApiPropertyOptional({ description: "Availability for sponsorship", example: true })
  @IsBoolean()
  @IsOptional()
  availableForSponsorship?: boolean;
}
