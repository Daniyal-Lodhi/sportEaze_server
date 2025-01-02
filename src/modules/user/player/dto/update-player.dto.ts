import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString, Length } from "class-validator";

export class UpdatePlayerDto {
  @IsInt()
  @IsOptional()
  preferredSport?: number;

  @ApiPropertyOptional({
    description: "Region name",
    example: "North",
    maxLength: 25,
  })
  @IsString()
  @IsOptional()
  @Length(1, 25)
  region: string;

  @ApiPropertyOptional({
    description: "Club name",
    example: "Chess Club",
    maxLength: 25,
  })
  @IsString()
  @IsOptional()
  @Length(1, 25)
  club?: string;

  @ApiPropertyOptional({
    description: "Short bio or description about the player",
    example: "Passionate about sports.",
    maxLength: 200,
  })
  @IsString()
  @IsOptional()
  @Length(1, 200)
  about?: string;
}
