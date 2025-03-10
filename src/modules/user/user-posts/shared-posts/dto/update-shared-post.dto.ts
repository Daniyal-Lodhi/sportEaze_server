import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class UpdateSharedPostDto {

  @ApiProperty({
    description: "The caption for the shared post",
    example: "HEllo world"
  })  
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  shareMessage?: string;

//   @IsOptional()
//   @IsEnum(PostVisibilityEnum)
//   @Transform(({ value }) => value ?? PostVisibilityEnum.PUBLIC) // Ensures default value
//   visibility?: PostVisibilityEnum;
}
