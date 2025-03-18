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
  fbLink?: string;

  @ApiPropertyOptional({
    description: "Instagram profile link",
    example: "https://instagram.com/username",
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  @IsUrl()
  @Length(1, 255)
  instaLink?: string;

  @ApiPropertyOptional({
    description: "X (formerly Twitter) profile link",
    example: "https://x.com/username",
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  @IsUrl()
  @Length(1, 255)
  xLink?: string;
}
