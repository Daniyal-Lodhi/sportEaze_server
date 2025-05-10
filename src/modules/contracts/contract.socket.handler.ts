// chat.socket.handler.ts
import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { CreateContractDto } from './dto/create-contract.dto';
import { ContractsService } from './contracts.service';
import { CONTRACT_RECEIVED } from 'src/common/consts/socket-events';

@Injectable()
export class ContractSocketHandler {
  private clients: Map<string, Socket>;

  constructor(private readonly contractService: ContractsService) { this.clients = new Map(); }

  setClientsMap(map: Map<string, Socket>) {
    this.clients = map;
  }

  async handleContractReceived(id: string, data: CreateContractDto) {
    const playerSocket = this.clients.get(data.playerId);
    const patronSocket = this.clients.get(id);

    const contract = await this.contractService.create(id, data);

    if(playerSocket) {
      playerSocket.emit(CONTRACT_RECEIVED, contract);
    }
    else {
      console.log(`Player ${data.playerId} not connected`);
    }

    if(patronSocket) {
      patronSocket.emit(CONTRACT_RECEIVED, contract);
    } else {
      console.log(`Patron ${id} not connected`);
    }
  }
}
