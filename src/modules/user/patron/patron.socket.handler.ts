// chat.socket.handler.ts
import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { PATRON_VERIFICATION } from 'src/common/consts/socket-events';
import { PatronAccountStatus } from 'src/common/enums/patron/patron.enum';
import { socketClients } from 'src/modules/socket/socket.gateway';

@Injectable()
export class PatronSocketHandler {
  emitPatronVerification(patronId: string, status: PatronAccountStatus) {
    const patronSocket = socketClients.get(patronId);
    if (patronSocket) {
      patronSocket.emit(PATRON_VERIFICATION, { status });
    } else {
      console.log(`Patron ${patronId} not connected`);
    }
  }

}
