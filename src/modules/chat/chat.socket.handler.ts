// chat.socket.handler.ts
import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { MESSAGE_SENT, RECEIVE_MESSAGE } from 'src/common/consts/socket-events';

@Injectable()
export class ChatSocketHandler {
  private clients: Map<string, Socket>;

  constructor(private readonly chatService: ChatService) {
    this.clients = new Map();
  }

  setClientsMap(map: Map<string, Socket>) {
    this.clients = map;
  }

  async handleSendMessage(senderId: string, createChatDto: CreateChatDto) {
    const { content, recipientId } = createChatDto;

    const msg = await this.chatService.sendMessageBetweenUsers(senderId, createChatDto);

    const recipientSocket = this.clients.get(recipientId);
    const senderSocket = this.clients.get(senderId);

    if (recipientSocket) {
      recipientSocket.emit(RECEIVE_MESSAGE, msg);
    } else {
      console.log(`Recipient ${recipientId} not connected`);
    }

    if(senderSocket)  {
    senderSocket.emit(MESSAGE_SENT, msg);
    }else {
      console.log(`Sender ${senderId} not connected`);
    }
  }
}
