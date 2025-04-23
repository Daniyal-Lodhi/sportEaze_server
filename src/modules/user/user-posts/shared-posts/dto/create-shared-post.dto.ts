import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateSharedPostDto {
  @ApiProperty({
    description: "The id of the original post",
    example: ""
  })

  @IsUUID()
  originalPostId: string;

  @ApiProperty({
    description: "The caption for the shared post",
    example: ""
  })
  
  @IsOptional()
  @IsString()
  shareMessage?: string;

//   @IsOptional()
//   @IsEnum(PostVisibilityEnum)
//   @Transform(({ value }) => value ?? PostVisibilityEnum.PUBLIC) // Ensures default value
//   visibility?: PostVisibilityEnum;
}
