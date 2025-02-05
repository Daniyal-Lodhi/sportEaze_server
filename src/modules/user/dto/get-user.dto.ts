import {
  IsString,
  IsEmail,
  IsOptional,
  IsDateString,
  MinLength,
  Matches,
} from "class-validator";
import { GenderType } from "src/common/enums/gender-type.enum";
import { UserType } from "src/common/enums/user-type.enum";

export class GetUserDto {
  @IsEmail()
  email?: string;

  @IsString()
  @IsOptional()
  @MinLength(3)
  name?: string;

  @IsString()
  @MinLength(3)
  @IsOptional()
  @Matches(/^@/, { message: 'Username must start with @' })
  username?: string;

  @IsOptional()
  @IsString()
  gender?: GenderType;

  @IsOptional()
  @IsString()
  userType?: UserType;

  @IsDateString()
  @IsOptional()
  dob?: Date;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  deleted?: boolean;

  @IsString()
  @IsOptional()
  profilePicUrl?: string;
}
