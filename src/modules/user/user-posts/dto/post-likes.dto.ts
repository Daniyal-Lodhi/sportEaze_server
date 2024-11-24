import { IsUUID, IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { ReactTypeEnum } from 'src/common/enums/user-posts.enum'; // Import the enum for react types
import { Type } from 'class-transformer';

export class PostLikesDTO {

  

  @IsUUID()
  userId: string;  

  @IsUUID()
  postId: string;  

  @IsOptional()  
  @IsBoolean()
  unLiked?: boolean;  

  @IsEnum(ReactTypeEnum)
  @IsOptional()
  reactType: ReactTypeEnum;  

  

 
}
