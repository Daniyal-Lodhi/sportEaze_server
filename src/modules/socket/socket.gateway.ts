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

@WebSocketGateway({ cors: { origin: '*' } })
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private clients: Map<string, Socket> = new Map();

  constructor(
    private jwtService: JwtService,
    private chatSocketHandler: ChatSocketHandler,
  ) {
    this.chatSocketHandler.setClientsMap(this.clients); // give the handler access
  }

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.split(' ')[1];
      const payload = this.jwtService.verify(token);

      client.data.user = payload;
      this.clients.set(payload.id, client);

      console.log(`Connected: ${payload.id}`);
    } catch (err) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const user = client.data.user;
    if (user) {
      this.clients.delete(user.id);
      console.log(`Disconnected: ${user.id}`);
    }
  }

  @SubscribeMessage('sendMessage')
  handleSendMessage(
    @MessageBody() data: CreateChatDto,
    @ConnectedSocket() client: Socket,
  ) {
    const sender = client.data.user;
    console.log(`Sender: ${JSON.stringify(sender)}`);
    console.log(`data: ${JSON.stringify(data)}`);
    this.chatSocketHandler.handleSendMessage(sender.id, data);
  }
}
