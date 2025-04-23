import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Message } from './entities/messages.entity';
import { Chat } from './entities/chat.entity';
import { ChatSocketHandler } from './chat.socket.handler';

@Module({
  imports: [TypeOrmModule.forFeature([User, Chat, Message])],
  controllers: [ChatController],
  providers: [ChatService, ChatSocketHandler],
  exports: [ChatService],
})
export class ChatModule {}
