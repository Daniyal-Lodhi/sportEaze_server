import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { LocalAuthModule } from "../auth/local-auth/local-auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { LocalAuthService } from "../auth/local-auth/local-auth.service";
import { JwtModule } from "@nestjs/jwt";
import { PlayerModule } from "./player/player.module";
import { UserPostModule } from "./user-posts/user-post.module";
import { FanController } from "./fan/fan.controller";
import { PatronModule } from "./patron/patron.module";
import { NetworkModule } from "./network/network.module";
import { MentorModule } from "./mentor/mentor.module";
import { SponsoredPostModule } from "./ads/sp-ads.module";
import { SharedPost } from "./user-posts/entities/shared-post.entity";
import { Endorsement } from "src/common/entities/endorsement.entity";
import { UserPost } from "./user-posts/entities/user-post.entity";
import { Comment } from "./user-posts/entities/post-comment.entity";
import { PostLikes } from "./user-posts/entities/post-like.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserPost, SharedPost, Comment, PostLikes, Endorsement]),
    LocalAuthModule,
    PlayerModule,
    PatronModule,
    MentorModule,
    UserPostModule,
    NetworkModule,
    SponsoredPostModule,
  ],
  controllers: [UserController, FanController],
  providers: [UserService],
})
export class UserModule {}
