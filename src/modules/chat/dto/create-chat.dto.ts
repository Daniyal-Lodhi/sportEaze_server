import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateChatDto {
  @ApiProperty({
    description: 'The content of the message to be sent',
    example: 'Hello! How are you?',
  })
  @IsString()
  content: string;
  
  @ApiProperty({
      description: 'The ID of the recipient user',
      example: 'user-uuid-here',
    })
    @IsString()
  recipientId: string;
}
