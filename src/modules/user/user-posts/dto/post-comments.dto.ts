import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CommentDTO {
   

  @IsUUID()
  @IsOptional()
  userId: string;  


  @IsUUID()
  @IsOptional()
  postId: string;  

  @IsString()
  @IsNotEmpty()
  content: string; 

  

}
