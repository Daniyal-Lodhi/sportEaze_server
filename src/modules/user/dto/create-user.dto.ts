import { IsString, IsEmail, IsBoolean, IsOptional, IsDateString, MaxLength, MinLength, Matches } from 'class-validator';

export class CreateUserDto {
    
    @IsEmail()
    email: string;

    @MinLength(8, { message: 'Password must be at least 8 characters long.' })
    @Matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/,
        { message: 'Password must contain at least one uppercase letter and one special character.' }
    )
    password: string;

    @IsBoolean()
    @IsOptional()
    recover: boolean = false;

}
