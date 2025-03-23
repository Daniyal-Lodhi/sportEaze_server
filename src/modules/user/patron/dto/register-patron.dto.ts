import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { PlayingLevel } from 'src/common/enums/player/playing-levels.enum';
import { BaseUserDto } from '../../dto/base-user.dto';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { GenderType } from 'src/common/enums/user/gender-type.enum';
import { PatronType, FundingType } from 'src/common/enums/patron/patron.enum';
import { Sport } from 'src/common/enums/sport/sport.enum';

export class RegisterPatronDto extends OmitType(BaseUserDto, ['dob', 'gender'] as const) {
  @ApiProperty({
    description: "The date of birth of the user in ISO 8601 format.",
    example: "1990-05-20",
    format: "date",
    required: false
  })
  @IsOptional()
  @IsDateString()
  dob?: Date;

  @ApiProperty({
    description: "The gender of the user.",
    example: GenderType.MALE,
    enum: GenderType,
    required: false
  })
  @IsOptional()
  @IsEnum(GenderType)
  gender?: GenderType;

  @ApiProperty({
    description: "The type of patron (Individual or Organization).",
    enum: PatronType,
    example: PatronType.INDIVIDUAL
  })
  @IsEnum(PatronType)
  patronType: PatronType;

  @ApiProperty({
    description: "Industry type (Only applicable for organizations).",
    example: "Sportswear",
    required: false
  })
  @IsOptional()
  @IsString()
  industryType?: string;

  @ApiProperty({
    description: "Sports categories the patron wants to support.",
    example: [Sport.FOOTBALL, Sport.TENNIS],
    required: false
  })
  @IsOptional()
  @IsEnum(Sport, { each: true })
  supportedSports?: Sport[];

  @ApiProperty({
    description: "Preferred athlete levels.",
    enum: PlayingLevel,
    isArray: true,
    example: [PlayingLevel.PROFESSIONAL, PlayingLevel.AMATEUR]
  })
  @IsEnum(PlayingLevel, { each: true })
  preferredPlayerLevels: PlayingLevel[];

  @ApiProperty({
    description: "Preferred funding types for athletes.",
    enum: FundingType,
    isArray: true,
    example: [FundingType.FULL_SPONSORSHIP, FundingType.EQUIPMENT_SUPPORT]
  })
  @IsEnum(FundingType, { each: true })
  preferredFundingTypes: FundingType[];

  @ApiProperty({
    description: "Website URL (optional).",
    example: "https://example.com",
    required: false
  })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiProperty({
    description: "LinkedIn profile URL (optional).",
    example: "https://linkedin.com/in/example",
    required: false
  })
  @IsOptional()
  @IsString()
  linkedIn?: string;

  @ApiProperty({
    description: "Facebook profile link.",
    example: "https://facebook.com/example"
  })
  @IsString()
  fbLink: string;

  @ApiProperty({
    description: "Twitter/X profile link.",
    example: "https://twitter.com/example"
  })
  @IsString()
  xLink: string;

  @ApiProperty({
    description: "Instagram profile link.",
    example: "https://instagram.com/example"
  })
  @IsString()
  instaLink: string;
}
