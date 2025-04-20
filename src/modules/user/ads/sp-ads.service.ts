import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { SponsoredPost } from "./entities/sponsored-post.entity";
import { SponsoredPostMedia } from "./entities/sp-media-urls.entity";
import { SponsoredPostTargetSport } from "./entities/sp-target-sports.entity";
import { Sport } from "src/common/enums/sport/sport.enum";
import { PostCategoryEnum,  MediaType  } from "src/common/enums/post/user-posts.enum";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UserService } from "../user.service";
import { GetUserDto } from "../dto/get-user.dto";
import { UserType } from "src/common/enums/user/user-type.enum";


@Injectable()
export class SponsoredPostService {
  constructor(
    @InjectRepository(SponsoredPost)
    private readonly sponsoredPostRepo: Repository<SponsoredPost>,
    @InjectRepository(SponsoredPostMedia)
    private readonly sponsoredPostMediaRepo: Repository<SponsoredPostMedia>,
    @InjectRepository(SponsoredPostTargetSport)
    private readonly sponsoredPostTargetSportRepo: Repository<SponsoredPostTargetSport>,
    private readonly userSrv: UserService
    
  ) {}

  async createSponsoredPost(userId:string,data: any): Promise<SponsoredPost> {
    try {
      const {
        post_type,
        ad_content,
        targeting,
        budget,
      } = data;

    // const user: GetUserDto = await this.userSrv.getUser(userId);
    // if (user.userType !== UserType.PATRON) {
    //     throw new HttpException("User is not a patron", HttpStatus.FORBIDDEN);
    // }

      

    const { text, media, cta_link } = ad_content;
    const { target_audience_age, target_sports_category, target_reachable_users } = targeting;
      const { amount_to_spend, currency } = budget;

      // Create sponsored post entity
      const sponsoredPost = this.sponsoredPostRepo.create({
        userId:userId , // Assuming you have the user ID from the request
        postType:post_type, // Make sure this matches your enum value
        text,
        ctaLink: cta_link,
        targetAudienceAge: target_audience_age,
        targetReachableUsers: target_reachable_users,
        amountToSpend: amount_to_spend,
        currency,
      });

      const savedPost = await this.sponsoredPostRepo.save(sponsoredPost);

      // Create media entities

      const mediaEntities = media.map((item: any) => {
        return this.sponsoredPostMediaRepo.create({
          mediaType: item.mediaType,
          mediaLink: item.mediaLink,
          mediaOrder: item.mediaOrder,
          mediaThumbnail: item.mediaThumbnail,
          sponsoredPostId: savedPost.id,
        });
      });
      

      await this.sponsoredPostMediaRepo.save(mediaEntities);

      // Create target sports entities
      const sportEntities = target_sports_category.map((sport: number) => {
        return this.sponsoredPostTargetSportRepo.create({
          sponsoredPostId: savedPost.id,
          sport: sport as Sport, // ensure it's cast correctly to enum
        });
      });

      await this.sponsoredPostTargetSportRepo.save(sportEntities);

      return savedPost;
    } catch (error) {
      console.error("[CREATE_SPONSORED_POST]:", error);
      throw new HttpException(
        error.message || "Failed to create sponsored post",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
