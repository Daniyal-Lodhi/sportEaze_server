// chat.socket.handler.ts
import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { PATRON_VERIFICATION } from 'src/common/consts/socket-events';
import { PatronAccountStatus } from 'src/common/enums/patron/patron.enum';

@Injectable()
export class PatronSocketHandler {
  public clients: Map<string, Socket>;

  constructor() {
    this.clients = new Map();
  }

  setClientsMap(map: Map<string, Socket>) {
    this.clients = map;
  }

  emitPatronVerification(patronId: string, status: PatronAccountStatus) {
    const patronSocket = this.clients.get(patronId);
    if (patronSocket) {
      patronSocket.emit(PATRON_VERIFICATION, { status });
    } else {
      console.log(`Patron ${patronId} not connected`);
    }
  }

}
