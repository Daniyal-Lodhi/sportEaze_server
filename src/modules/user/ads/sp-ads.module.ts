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
import { NetworkSocketHandler } from "../network/network.socket.handler";
import { NotificationsService } from "src/modules/notifications/notifications.service";
import { Notification } from "src/modules/notifications/entities/notification.entity";
import { NotificationSocketHandler } from "src/modules/notifications/notification.socket.handler";
import { UserPost } from "../user-posts/entities/user-post.entity";
import { SharedPost } from "../user-posts/entities/shared-post.entity";
import { Comment } from "../user-posts/entities/post-comment.entity";
import { PostLikes } from "../user-posts/entities/post-like.entity";
import { Endorsement } from "src/common/entities/endorsement.entity";
import { Contract } from "src/modules/contracts/entities/contract.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, UserPost,SharedPost, Comment, PostLikes, Endorsement, SponsoredPost,SponsoredPostTargetSport,SponsoredPostMedia,Connection,Followers, Notification, Contract])],
  controllers: [SponsoredPostsController],
  providers: [SponsoredPostService,UserService,LocalAuthService,JwtService,NetworkService, NetworkSocketHandler, NotificationsService, NotificationSocketHandler],
})
export class SponsoredPostModule { }
