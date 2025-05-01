// chat.socket.handler.ts
import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { CONNECTION_REQUEST, RECEIVE_MESSAGE } from 'src/common/consts/socket-events';
import { ConnectionStatus } from 'src/common/enums/network/network.enum';

@Injectable()
export class NetworkSocketHandler {
  private clients: Map<string, Socket>;

  constructor() {
    this.clients = new Map();
  }

  setClientsMap(map: Map<string, Socket>) {
    this.clients = map;
  }

  sendConnectionRequestNotification(requester_id: string, receiver_id: string, connection: { id: string; status: ConnectionStatus; receiverId: string; }) {
    const receiverSocket = this.clients.get(receiver_id);

    const data = { ...connection, requester_id, receiver_id };

    if (receiverSocket) {
      receiverSocket.emit(CONNECTION_REQUEST, data);
    } else {
      console.log(`Receiver ${receiver_id} not connected`);
    }
  }
}
