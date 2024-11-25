import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";

export class DeleteSocialMediaDto {
  @ApiPropertyOptional({
    description: "Flag to indicate if the Facebook link should be deleted",
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  Delete_FB_link?: boolean;

  @ApiPropertyOptional({
    description: "Flag to indicate if the Instagram link should be deleted",
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  Delete_INSTA_link?: boolean;

  @ApiPropertyOptional({
    description:
      "Flag to indicate if the X (formerly Twitter) link should be deleted",
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  Delete_X_link?: boolean;
}
