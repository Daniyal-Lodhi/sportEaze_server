import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength, Matches, IsDateString, IsEnum } from "class-validator";
import { GenderType } from "src/common/enums/gender-type.enum";

export class BaseUserDto {

    @ApiProperty({
        description: "The URL of the user's profile picture.",
        example: "https://example.com/profile.jpg",
      })
      @IsString()
      profilePicUrl: string;
    
  
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