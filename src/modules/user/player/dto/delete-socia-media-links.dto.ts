import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";

export class DeleteSocialMediaDto {
  @ApiPropertyOptional({
    description: "Flag to indicate if the Facebook link should be deleted",
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  deleteFbLink?: boolean;

  @ApiPropertyOptional({
    description: "Flag to indicate if the Instagram link should be deleted",
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  deleteInstaLink?: boolean;

  @ApiPropertyOptional({
    description:
      "Flag to indicate if the X (formerly Twitter) link should be deleted",
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  deleteXLink?: boolean;
}
