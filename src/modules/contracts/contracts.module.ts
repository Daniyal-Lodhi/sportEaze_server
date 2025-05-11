import { Module } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { ContractsController } from './contracts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Milestone } from './entities/milestones.entity';
import { Contract } from './entities/contract.entity';
import { User } from '../user/entities/user.entity';
import { ContractSocketHandler } from './contract.socket.handler';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationSocketHandler } from '../notifications/notification.socket.handler';
import { Notification } from '../notifications/entities/notification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Contract, Milestone, Notification])],
  controllers: [ContractsController],
  providers: [ContractsService, ContractSocketHandler, NotificationsService, NotificationSocketHandler],
  exports: [ContractsService],
})
export class ContractsModule {}
