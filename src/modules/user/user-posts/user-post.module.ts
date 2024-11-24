import { Module } from '@nestjs/common';
import { UserPostController } from './user-post.controller';
import { UserPostService } from './user-post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
 import { UserPost } from './entities/user-post.entity';
import { PostMedia } from './entities/post-media.entity';

@Module({
    imports:[TypeOrmModule.forFeature([UserPost,PostMedia])],
    controllers: [UserPostController],
    providers: [UserPostService]
})
export class UserPostModule { }
