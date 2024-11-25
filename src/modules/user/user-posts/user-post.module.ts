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

@Module({
  imports: [TypeOrmModule.forFeature([UserPost, PostMedia, User])],
  controllers: [UserPostController],
  providers: [UserPostService, UserService, LocalAuthService, JwtService],
})
export class UserPostModule {}
