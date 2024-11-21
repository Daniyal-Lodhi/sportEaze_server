import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl, Length } from "class-validator";

export class AddSocialMediaLinkDto {
    @IsString()
    @IsOptional()
    @IsUrl()
    @Length(1, 255)
    FB_link?: string;
    
    @IsString()
    @IsOptional()
    @IsUrl()
    @Length(1, 255)
    INSTA_link?: string;
    
    @IsString()
    @IsOptional()
    @IsUrl()
    @Length(1, 255)
    X_link?: string;
}
