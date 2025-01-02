import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsBoolean,
  IsOptional,
  MinLength,
  Matches,
} from "class-validator";

export class CreateUserDto {
  @ApiProperty({
    description: "The email address of the user.",
    example: "user@example.com",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description:
      "The user's password. Must be at least 8 characters long, with at least one uppercase letter and one special character.",
    example: "SecurePassword!123",
    minLength: 8,
  })
  @MinLength(8, { message: "Password must be at least 8 characters long." })
  @Matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/, {
    message:
      "Password must contain at least one uppercase letter and one special character.",
  })
  password: string;

  @ApiProperty({
    description: "Flag indicating whether this is a recovery operation.",
    example: false,
    required: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  recover: boolean = false;
}
