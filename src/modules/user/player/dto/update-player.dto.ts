import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min, Max, IsString, Length, ArrayNotEmpty, ValidateNested } from 'class-validator';

export class UpdatePlayerDto {
    @IsInt()
    @IsOptional()
    preferredSport?: number;
    
    @IsString()
    @IsOptional()
    @Length(1, 25)
    region: string;
    
    @IsString()
    @IsOptional()
    @Length(1, 25)
    club?: string;
    
    @IsString()
    @IsOptional()
    @Length(1, 200)
    about?: string;
}
