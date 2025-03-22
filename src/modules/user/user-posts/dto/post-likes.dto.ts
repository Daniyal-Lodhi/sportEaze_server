import { IsUUID, IsBoolean, IsEnum, IsOptional } from "class-validator";
import { ReactTypeEnum } from "src/common/enums/post/user-posts.enum"; // Import the enum for react types

export class PostLikesDTO {
  @IsUUID()
  userId: string;

  @IsUUID()
  postId: string;


  @IsEnum(ReactTypeEnum)
  @IsOptional()
  reactType?: ReactTypeEnum;
}
