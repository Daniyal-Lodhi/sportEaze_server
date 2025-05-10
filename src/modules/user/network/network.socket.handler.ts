// chat.socket.handler.ts
import { Injectable } from '@nestjs/common';
import { CONNECTION_REQUEST, CONNECTION_RESPONSE } from 'src/common/consts/socket-events';
import { ConnectionStatus } from 'src/common/enums/network/network.enum';
import { socketClients } from 'src/modules/socket/socket.gateway';

@Injectable()
export class NetworkSocketHandler {
  HandleConnectionRequest(requester_id: string, receiver_id: string, connection: { id: string; status: ConnectionStatus; receiverId: string; }) {
    const receiverSocket = socketClients.get(receiver_id);
    
    const data = { ...connection, requester_id, receiver_id };
    
    if (receiverSocket) {
      receiverSocket.emit(CONNECTION_REQUEST, data);
    } else {
      console.log(`Receiver ${receiver_id} not connected`);
    }
  }
  
  HandleConnectionRespond(requester_id: string, receiver_id: string, connection: { id: string; status: ConnectionStatus; receiverId: string; }) {
    const receiverSocket = socketClients.get(receiver_id);

    const data = { ...connection, requester_id, receiver_id };

    if (receiverSocket) {
      receiverSocket.emit(CONNECTION_RESPONSE, data);
    } else {
      console.log(`Receiver ${receiver_id} not connected`);
    }
  }
}
