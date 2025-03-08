import { IsEnum, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ReactTypeEnum } from 'src/common/enums/user-posts.enum';

export class LikePostDto {
  @IsEnum(ReactTypeEnum)
  @IsNotEmpty()
  reactType?: ReactTypeEnum;

  @IsBoolean()
  @IsNotEmpty()
  unLike: boolean ; // Default to false if not provided
}
