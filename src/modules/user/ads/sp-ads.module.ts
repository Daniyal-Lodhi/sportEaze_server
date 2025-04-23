import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { SponsoredPostsController } from "./sp-ads.controller";
import { SponsoredPostService } from "./sp-ads.service";
import { UserService } from "../user.service";
import { SponsoredPostMedia } from "./entities/sp-media-urls.entity";
import { SponsoredPostTargetSport } from "./entities/sp-target-sports.entity";
import { SponsoredPost } from "./entities/sponsored-post.entity";
import { LocalAuthService } from "src/modules/auth/local-auth/local-auth.service";
import { JwtService } from "@nestjs/jwt";
import { NetworkService } from "../network/network.service";
import { Connection } from "../network/entities/connection.entity";
import { Followers } from "../network/entities/follower.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User,SponsoredPost,SponsoredPostTargetSport,SponsoredPostMedia,Connection,Followers])],
  controllers: [SponsoredPostsController],
  providers: [SponsoredPostService,UserService,LocalAuthService,JwtService,NetworkService],
})
export class SponsoredPostModule { }
