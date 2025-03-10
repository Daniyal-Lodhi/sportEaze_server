import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CommentPostDto {
  @ApiProperty({
    description: 'Content of the comment',
    example: 'This is a great post!',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({
    description: 'Id of the parent comment',
    example: "uuid",})
  @IsString()
  @IsOptional()
  parentCommentId?: string;
}
