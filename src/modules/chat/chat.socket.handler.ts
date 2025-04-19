// chat.socket.handler.ts
import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';

@Injectable()
export class ChatSocketHandler {
  private clients: Map<string, Socket>;

  constructor(private readonly chatService: ChatService) {
    this.clients = new Map();
  }

  setClientsMap(map: Map<string, Socket>) {
    this.clients = map;
  }

  handleSendMessage(senderId: string, createChatDto: CreateChatDto) {
    const { content, recipientId } = createChatDto;

    this.chatService.sendMessageBetweenUsers(senderId, createChatDto);

    const recipientSocket = this.clients.get(recipientId);

    if (recipientSocket) {
      recipientSocket.emit('receive_message', {
        from: senderId,
        message: content,
      });
    } else {
      console.log(`Recipient ${recipientId} not connected`);
    }
  }
}
