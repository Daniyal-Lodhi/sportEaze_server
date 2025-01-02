import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsUrl, Length } from "class-validator";

export class AddSocialMediaLinkDto {
  @ApiPropertyOptional({
    description: "Facebook profile link",
    example: "https://facebook.com/username",
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  @IsUrl()
  @Length(1, 255)
  FB_link?: string;

  @ApiPropertyOptional({
    description: "Instagram profile link",
    example: "https://instagram.com/username",
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  @IsUrl()
  @Length(1, 255)
  INSTA_link?: string;

  @ApiPropertyOptional({
    description: "X (formerly Twitter) profile link",
    example: "https://x.com/username",
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  @IsUrl()
  @Length(1, 255)
  X_link?: string;
}
