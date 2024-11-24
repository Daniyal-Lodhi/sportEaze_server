import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { PostVisibilityEnum } from 'src/common/enums/user-posts.enum';
import { PostLikesDTO } from './post-likes.dto';
import { CommentDTO } from './post-comments.dto';

export class CreateTextPostDTO {
  

  @IsUUID()
  @IsOptional()
  userId: string;  
  
  @IsString()
  @IsNotEmpty()
  textContent: string; 

  @IsEnum(PostVisibilityEnum)
  @IsOptional()
  visibility?: PostVisibilityEnum;  

  @IsOptional()  
  shareCount: number;




  @IsOptional()
  likes?: PostLikesDTO[];  
  
  @IsOptional()
  comments?: CommentDTO[];  

}
