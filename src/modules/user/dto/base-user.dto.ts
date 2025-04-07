import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, MinLength, Matches, IsDateString, IsEnum, IsOptional } from "class-validator";
import { DEFAULT_USER_PROFILE_PIC_URL } from "src/common/consts/user-const";
import { GenderType } from "src/common/enums/user/gender-type.enum";

export class BaseUserDto {

  @ApiPropertyOptional({
    description: "The URL of the user's profile picture.",
    example: 'https://yourdomain.com/default-profile-pic.png',
  })
  @IsString()
  @IsOptional()
  profilePicUrl?: string = DEFAULT_USER_PROFILE_PIC_URL; // Default profile picture URL
    
  
    @ApiProperty({
      description: "The name of the user. Must be at least 3 characters long.",
      example: "John Doe",
      minLength: 3,
    })
    @IsString()
    @MinLength(3)
    fullName: string;
  
    @ApiProperty({
      description: 'Username that must start with "@" and be at least 4 characters long.',
      minLength: 4,
      pattern: '^@',
      example: '@exampleUser',
    })
    @IsString()
    @MinLength(4, { message: 'Username must be at least 4 characters long.' })
    @Matches(/^@/, { message: 'Username must start with @' })
    username: string;
  
    @ApiProperty({
        description: "The date of birth of the user in ISO 8601 format.",
        example: "1990-05-20",
        format: "date",
      })
      @IsDateString()
      dob: Date;
    
  
  
    @ApiProperty({
      description: "The gender of the user.",
      example: GenderType.MALE,
      enum: GenderType,
    })
    @IsEnum(GenderType)
    gender: GenderType;
  
}