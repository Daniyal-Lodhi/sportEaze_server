import { ArrayNotEmpty, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min, MinLength } from 'class-validator';
import { MediaType } from 'src/common/enums/user-posts.enum'; // Enum for MediaType

export class PostMediaDTO {
  @IsEnum(MediaType)
  @IsNotEmpty()
  mediaType: MediaType;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  mediaOrder: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  mediaLink: string
}
