import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString, IsBoolean, IsOptional, IsArray, Length, IsUrl } from "class-validator";
import { Sport } from "src/common/enums/sport.enum";
import { PlayingLevel } from "src/common/enums/playing-levels.enum";
import { BaseUserDto } from "../../dto/base-user.dto";

export class RegisterPlayerDto extends BaseUserDto {
  @ApiProperty({
    description: "Primary sport the player specializes in.",
    example: Sport.CRICKET,
  })
  @IsEnum(Sport)
  primarySport: Sport;

  @ApiProperty({
    description: "List of secondary sports the player participates in.",
    example: [Sport.HOCKEY, Sport.FOOTBALL],
    required: false,
  })
  @IsArray()
  @IsEnum(Sport, { each: true })
  @IsOptional()
  secondarySports?: Sport[];

  @ApiProperty({
    description: "Current playing level of the player.",
    example: PlayingLevel.PROFESSIONAL,
  })
  @IsEnum(PlayingLevel)
  playingLevel: PlayingLevel;

  @ApiProperty({
    description: "Name of the current team the player is associated with.",
    example: "Pakistan National Cricket Team",
    maxLength: 50,
    required: false,
  })
  @IsString()
  @IsOptional()
  @Length(1, 50)
  currentTeam?: string;

  @ApiProperty({
    description: "Name of the player's coach.",
    example: "Grant Bradburn",
    maxLength: 50,
    required: false,
  })
  @IsString()
  @IsOptional()
  @Length(1, 50)
  coachName?: string;

  @ApiProperty({
    description: "Short bio or description about the player's background and achievements.",
    example: "Captain of Pakistan cricket team and ICC No.1 ranked batsman in ODI format.",
    maxLength: 200,
    required: false,
  })
  @IsString()
  @IsOptional()
  @Length(1, 200)
  playerBio?: string;

  @ApiProperty({
    description: "Location where the player usually trains.",
    example: "National High-Performance Center, Lahore",
    maxLength: 200,
    required: false,
  })
  @IsString()
  @IsOptional()
  @Length(1, 200)
  trainingLocation?: string;

  @ApiProperty({
    description: "Indicates whether the player is open for sponsorship opportunities.",
    example: true,
  })
  @IsBoolean()
  availableForSponsorship: boolean;

  @ApiProperty({
    description: "Player's official Facebook profile link.",
    example: "https://www.facebook.com/BabarAzamOfficial",
    required: false,
  })
  @IsUrl()
  @IsOptional()
  fbLink?: string;

  @ApiProperty({
    description: "Player's official Instagram profile link.",
    example: "https://www.instagram.com/babarazam",
    required: false,
  })
  @IsUrl()
  @IsOptional()
  instaLink?: string;

  @ApiProperty({
    description: "Player's official Twitter (X) profile link.",
    example: "https://x.com/babarazam258",
    required: false,
  })
  @IsUrl()
  @IsOptional()
  xLink?: string;
}