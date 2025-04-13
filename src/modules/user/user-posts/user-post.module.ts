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
import { SharedPostsController } from "./shared-posts/shared-posts.controller";
import { SharedPostsService } from "./shared-posts/shared-posts.service";
import { SharedPost } from "./entities/shared-post.entity";
import { PostCommentsController } from "./post-comments/post-comments.controller";
import { PostCommentsService } from "./post-comments/post-comments.service";
import { Comment } from "./entities/post-comment.entity";
import { PostCommentsGateway } from "./post-comments/post-comments.gateway";
import { PostLikesGateway } from "./post-likes/post-likes.gateway";
import { NetworkService } from "../network/network.service";
import { NetworkModule } from "../network/network.module";

@Module({
  imports: [TypeOrmModule.forFeature([UserPost, PostMedia, User, PostLikes, SharedPost, Comment]), NetworkModule],
  controllers: [UserPostController,PostLikesController, SharedPostsController, PostCommentsController],
  providers: [UserPostService, UserService, LocalAuthService, JwtService, PostLikesService, SharedPostsService, PostCommentsService, PostCommentsGateway, PostLikesGateway],
  exports: [UserPostService]
})
export class UserPostModule { }
