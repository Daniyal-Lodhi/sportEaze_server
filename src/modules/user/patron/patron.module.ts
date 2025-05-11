import { Module } from '@nestjs/common';
import { PatronService } from './patron.service';
import { PatronController } from './patron.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patron } from './entities/patron.entity';
import { UserService } from '../user.service';
import { User } from '../entities/user.entity';
import { LocalAuthModule } from 'src/modules/auth/local-auth/local-auth.module';
import { LocalAuthService } from 'src/modules/auth/local-auth/local-auth.service';
import { JwtService } from '@nestjs/jwt';
import { NetworkModule } from '../network/network.module';
import { PatronSocketHandler } from './patron.socket.handler';
import { Wallet } from 'src/common/entities/wallet.entity';
import { UserPost } from '../user-posts/entities/user-post.entity';
import { SharedPost } from '../user-posts/entities/shared-post.entity';
import { Comment } from '../user-posts/entities/post-comment.entity';
import { PostLikes } from '../user-posts/entities/post-like.entity';
import { Endorsement } from 'src/common/entities/endorsement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Patron, User, Wallet, UserPost, SharedPost, Comment, PostLikes, Endorsement]), LocalAuthModule, NetworkModule],
  controllers: [PatronController],
  providers: [PatronService, UserService, PatronSocketHandler],
})
export class PatronModule {}
