import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class UpdateSharedPostDto {
  @ApiProperty({
    description: "The id of the original post",
    example: ""
  })

  @IsUUID()
  SharedPostId: string;

  @ApiProperty({
    description: "The caption for the shared post",
    example: ""
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
