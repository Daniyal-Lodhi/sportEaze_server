import { Module } from "@nestjs/common";
import { UserPostController } from "./user-post.controller";
import { UserPostService } from "./user-post.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserPost } from "./entities/user-post.entity";
import { PostMedia } from "./entities/post-media.entity";
import { UserService } from "../user.service";
import { LocalAuthService } from "src/modules/auth/local-auth/local-auth.service";
import { User } from "../entities/user.entity";
import { JwtService } from "@nestjs/jwt";
import { PostLikesController } from "./post-likes/post-likes.controller";
import { PostLikesService } from "./post-likes/post-likes.service";
import { PostLikes } from "./entities/post-like.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UserPost, PostMedia, User,PostLikes])],
  controllers: [UserPostController,PostLikesController],
  providers: [UserPostService, UserService, LocalAuthService, JwtService,PostLikesService],
})
export class UserPostModule {}
