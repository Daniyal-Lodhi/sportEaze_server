import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

import { ChatSocketHandler } from '../chat/chat.socket.handler';
import { CreateChatDto } from '../chat/dto/create-chat.dto';
import { PatronSocketHandler } from '../user/patron/patron.socket.handler';
import { IS_MSG_TYPING, SEND_MESSAGE } from 'src/common/consts/socket-events';

@WebSocketGateway({ cors: { origin: '*' } })
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private clients: Map<string, Socket> = new Map();

  constructor(
    private jwtService: JwtService,
    private chatSocketHandler: ChatSocketHandler,
    private patronSocketHandler: PatronSocketHandler,
  ) {
    this.chatSocketHandler.setClientsMap(this.clients); // give the handler access
    this.patronSocketHandler.setClientsMap(this.clients);
  }

  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth.token ||
        client.handshake.headers.authorization?.split(' ')[1];
  
      const payload = this.jwtService.verify(token);
      client.data.user = payload;
  
      this.clients.set(payload.id, client);
  
      console.log(`Connected: ${payload.id}`);
  
      client.emit("success-connection", {
        message: "Connection successful",
        userId: payload.id,
      });
  
    } catch (err) {
      console.error("Connection failed:", err.message || err);
      client.disconnect();
    }
  }  

  async handleDisconnect(client: Socket) {
    const user = client.data.user;
    if (user) {
      this.clients.delete(user.id);
      console.log(`Disconnected: ${user.id}`);
    }
  }

  @SubscribeMessage(SEND_MESSAGE)
  async handleSendMessage(
    @MessageBody() data: CreateChatDto,
    @ConnectedSocket() client: Socket,
  ) {
    const sender = client.data.user;
    console.log(`Sender: ${JSON.stringify(sender)}`);
    console.log(`data: ${JSON.stringify(data)}`);
    this.chatSocketHandler.handleSendMessage(sender.id, data);
  }

  @SubscribeMessage(IS_MSG_TYPING)
  async handleIsMsgTyping(
    @MessageBody() data: { chatId: string; receiverId: string, contentLength: number },
    @ConnectedSocket() client: Socket,
  ) {
    const recieverSocket = this.clients.get(data.receiverId);

    if(recieverSocket) {
      recieverSocket.emit(IS_MSG_TYPING, {...data, senderId: client.data.user.id});
    }
    else {
      console.log(`Receiver socket not found for userId: ${data.receiverId}`);
    }
  }
}
