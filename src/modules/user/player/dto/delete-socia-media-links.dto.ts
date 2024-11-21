import { IsBoolean, IsOptional } from "class-validator";

export class DeleteSocialMediaDto {
    @IsBoolean()
    @IsOptional()
    Delete_FB_link?: boolean;
    
    @IsBoolean()
    @IsOptional()
    Delete_INSTA_link?: boolean;
    
    @IsBoolean()
    @IsOptional()
    Delete_X_link?: boolean;
}
