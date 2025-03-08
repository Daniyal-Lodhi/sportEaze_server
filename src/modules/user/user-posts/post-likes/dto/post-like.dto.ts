import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ReactTypeEnum } from 'src/common/enums/user-posts.enum';

export class LikePostDto {
  @ApiPropertyOptional({
    enum: ReactTypeEnum,
    enumName: 'ReactTypeEnum',
    description: 'Type of reaction. Required when unLike is false.',
    example: ReactTypeEnum.HEART
  })
  @IsEnum(ReactTypeEnum)
  @IsNotEmpty()
  reactType?: ReactTypeEnum;

  @ApiProperty({
    type: Boolean,
    required: true,
    description: 'Indicates if the user wants to remove the like. This field is required.',
    example: false
  })
  @IsBoolean()
  @IsNotEmpty()
  unLike: boolean ; // Default to false if not provided
}
