import { IsString, IsEmail, IsBoolean, IsOptional, IsDateString, MaxLength, MinLength, Matches, IsEnum } from 'class-validator';
import { GenderType } from 'src/common/enums/gender-type.enum';
import { UserType } from 'src/common/enums/user-type.enum';

export class UpdateUserDto {
  @IsString()
  @MinLength(3)
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  @Matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/,
    { message: 'Password must contain at least one uppercase letter and one special character.' }
  )
  password?: string;


  @IsOptional()
  @IsString()
  gender?: GenderType;

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
