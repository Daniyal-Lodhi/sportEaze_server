import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ChatSocketHandler } from '../chat/chat.socket.handler';
import { ChatService } from '../chat/chat.service';
import { ChatModule } from '../chat/chat.module';
import { PatronSocketHandler } from '../user/patron/patron.socket.handler';
import { ContractSocketHandler } from '../contracts/contract.socket.handler';
import { ContractsModule } from '../contracts/contracts.module';
import { NetworkSocketHandler } from '../user/network/network.socket.handler';

@Module({
  imports: [
    ChatModule,
    ContractsModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get("JWT_SECRET"),
          signOptions: { expiresIn: "1y" },
        };
      },
    }),  ],
  providers: [SocketGateway, ChatSocketHandler, PatronSocketHandler, NetworkSocketHandler, ContractSocketHandler],
})

export class SocketModule {}
