import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Message } from './entities/messages.entity';
import { Chat } from './entities/chat.entity';
import { ChatSocketHandler } from './chat.socket.handler';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationSocketHandler } from '../notifications/notification.socket.handler';
import { Notification } from '../notifications/entities/notification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Chat, Message, Notification])],
  controllers: [ChatController],
  providers: [ChatService, ChatSocketHandler, NotificationsService, NotificationSocketHandler],
  exports: [ChatService],
})
export class ChatModule {}
