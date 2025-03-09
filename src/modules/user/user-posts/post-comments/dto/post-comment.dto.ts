import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CommentPostDto {
  @ApiProperty({
    description: 'Content of the comment',
    example: 'This is a great post!',
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
