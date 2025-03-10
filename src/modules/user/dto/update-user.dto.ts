import {
  IsString,
  IsOptional,
  IsDateString,
  MinLength,
  Matches,
  IsEnum,
} from "class-validator";
import { GenderType } from "src/common/enums/gender-type.enum";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateUserDto {
  @ApiProperty({
    description: "The name of the user. Must be at least 3 characters long.",
    example: "John Doe",
    required: false,
    minLength: 3,
  })
  @IsString()
  @MinLength(3)
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Optional username that must start with "@" and be at least 4 characters long.',
    minLength: 4,
    pattern: '^@',
    example: '@exampleUser',
  })
  @IsString()
  @MinLength(4, { message: 'Username must be at least 4 characters long.' })
  @IsOptional()
  @Matches(/^@/, { message: 'Username must start with @' })
  username?: string;

  @ApiProperty({
    description:
      "The new password for the user. Must be at least 8 characters long with at least one uppercase letter and one special character.",
    example: "NewPassword!123",
    required: false,
    minLength: 8,
  })
  @IsString()
  @IsOptional()
  @MinLength(8, { message: "Password must be at least 8 characters long." })
  @Matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/, {
    message:
      "Password must contain at least one uppercase letter and one special character.",
  })
  password?: string;

  @ApiProperty({
    description: "The gender of the user.",
    example: GenderType.MALE,
    required: false,
    enum: GenderType,
  })
  @IsOptional()
  @IsEnum(GenderType)
  gender?: GenderType;

  @ApiProperty({
    description: "The date of birth of the user in ISO 8601 format.",
    example: "1990-05-20",
    required: false,
    format: "date",
  })
  @IsDateString()
  @IsOptional()
  dob?: Date;

  @ApiProperty({
    description: "The city where the user resides.",
    example: "Karachi",
    required: false,
  })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({
    description: "The country where the user resides.",
    example: "Pakistan",
    required: false,
  })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty({
    description: "The URL of the user's profile picture.",
    example: "https://example.com/profile.jpg",
    required: false,
  })
  @IsString()
  @IsOptional()
  profilePicUrl?: string;
}
