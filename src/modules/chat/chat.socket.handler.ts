// chat.socket.handler.ts
import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { MESSAGE_SENT, RECEIVE_MESSAGE } from 'src/common/consts/socket-events';
import { socketClients } from '../socket/socket.gateway';

@Injectable()
export class ChatSocketHandler {
  constructor(private readonly chatService: ChatService) {}

  async handleSendMessage(senderId: string, createChatDto: CreateChatDto) {
    const { content, recipientId } = createChatDto;

    const [ msgForSender, msgForReceiver ]  = await this.chatService.sendMessageBetweenUsers(senderId, createChatDto);

    const recipientSocket = socketClients.get(recipientId);
    const senderSocket = socketClients.get(senderId);

    if (recipientSocket) {
      recipientSocket.emit(RECEIVE_MESSAGE, msgForReceiver);
    } else {
      console.log(`Recipient ${recipientId} not connected`);
    }

    if(senderSocket)  {
    senderSocket.emit(MESSAGE_SENT, msgForSender);
    }else {
      console.log(`Sender ${senderId} not connected`);
    }
  }
}
