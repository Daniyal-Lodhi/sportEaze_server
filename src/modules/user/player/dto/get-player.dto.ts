import { IsInt, IsNumber, IsString, isTimeZone } from "class-validator";
import { Achievement } from "src/common/entities/achievement.entity";
import { Contract } from "src/common/entities/contract.entity";
import { RatingAndReview } from "src/common/entities/rating-reviews.entity";
import { Sport } from "src/common/entities/sport.entity";
import { User } from "src/modules/user/entities/user.entity";

export class GetPlayerDto {
    @IsString()
    id: string;
    
    @IsInt()
    preferredSport?: Sport;
        
    @IsInt()
    rank?: number;
    
    @IsString()
    region: string;
    
    @IsString()
    club: string;
    
    @IsString()
    about: string;

    @IsString()
    FB_link: string

    @IsString()
    INSTA_link: string

    @IsString()
    X_link: string
    
    achievements?: Achievement[];

    contracts?: Contract[];

    ratingAndReviews: RatingAndReview[]

    user: User;
}