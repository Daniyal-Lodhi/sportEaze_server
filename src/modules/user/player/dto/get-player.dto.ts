import { IsBoolean, IsEnum, IsInt, IsString } from "class-validator";
import { Achievement } from "src/common/entities/achievement.entity";
import { RatingAndReview } from "src/common/entities/rating-reviews.entity";
import { PlayingLevel } from "src/common/enums/player/playing-levels.enum";
import { Sport } from "src/common/enums/sport/sport.enum";
import { User } from "src/modules/user/entities/user.entity";

export class GetPlayerDto {
  @IsString()
  id: string;

  @IsEnum(Sport)
  primarySport?: Sport;
 
  @IsEnum(Sport)
  secondarySports?: Sport[];

  @IsEnum(PlayingLevel)
  playingLevel?: PlayingLevel;

  @IsString()
  currentTeam?: string;

  @IsString()
  coachName?: string;
  
  @IsString()
  playerBio?: string;

  @IsString()
  trainingLocation?: string;

  @IsInt()
  rank?: number;

  @IsString()
  fbLink?: string;

  @IsString()
  instaLink?: string;

  @IsString()
  xLink?: string;

  @IsBoolean()
  availableForSponsorship?: boolean;

  // achievements?: Achievement[];

  // contracts?: Contract[];

  // ratingAndReviews: RatingAndReview[];

  user: User;
}
