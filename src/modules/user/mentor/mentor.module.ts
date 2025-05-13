import { Module } from '@nestjs/common';
import { MentorService } from './mentor.service';
import { MentorController } from './mentor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mentor } from './entities/mentor.entity';
import { NetworkModule } from '../network/network.module';
import { UserService } from '../user.service';
import { User } from '../entities/user.entity';
import { LocalAuthModule } from 'src/modules/auth/local-auth/local-auth.module';
import { Player } from '../player/entities/player.entity';
import { Endorsement } from 'src/common/entities/endorsement.entity';
import { PostLikes } from '../user-posts/entities/post-like.entity';
import { SharedPost } from '../user-posts/entities/shared-post.entity';
import { UserPost } from '../user-posts/entities/user-post.entity';
import { Comment } from '../user-posts/entities/post-comment.entity';
import { Contract } from 'src/modules/contracts/entities/contract.entity';
import { NotificationsService } from 'src/modules/notifications/notifications.service';
import { Notification } from 'src/modules/notifications/entities/notification.entity';
import { NotificationSocketHandler } from 'src/modules/notifications/notification.socket.handler';

@Module({
  imports: [TypeOrmModule.forFeature([Mentor, User, Player, UserPost, SharedPost, Comment, PostLikes, Endorsement, Contract, Notification

  ]), LocalAuthModule, NetworkModule],
  controllers: [MentorController],
  providers: [MentorService, UserService, NotificationsService, NotificationSocketHandler],
})
export class MentorModule {}
