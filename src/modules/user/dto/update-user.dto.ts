import { ApiProperty, OmitType, PartialType } from "@nestjs/swagger";
import { RegisterUserDto } from "./register-user.dto";
import { IsString, IsOptional, MinLength, Matches } from "class-validator";

export class UpdateUserDto extends PartialType(OmitType(RegisterUserDto, ["username"] as const)) {
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
 }
