import { Module } from '@nestjs/common';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPost } from '../user/user-posts/entities/user-post.entity';
import { SharedPost } from '../user/user-posts/entities/shared-post.entity';
import { PostLikesService } from '../user/user-posts/post-likes/post-likes.service';
import { PostLikes } from '../user/user-posts/entities/post-like.entity';
import { User } from '../user/entities/user.entity';
import { PostLikesGateway } from '../user/user-posts/post-likes/post-likes.gateway';
import { UserService } from '../user/user.service';
import { LocalAuthModule } from '../auth/local-auth/local-auth.module';
import { NetworkModule } from '../user/network/network.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserPost, SharedPost, PostLikes, User]), NetworkModule, LocalAuthModule],
  controllers: [FeedController],
  providers: [FeedService, PostLikesService, PostLikesGateway, UserService],
})
export class FeedModule {}
