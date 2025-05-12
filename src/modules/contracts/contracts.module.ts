import { Module } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { ContractsController } from './contracts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Milestone } from './entities/milestones.entity';
import { Contract } from './entities/contract.entity';
import { User } from '../user/entities/user.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationSocketHandler } from '../notifications/notification.socket.handler';
import { Notification } from '../notifications/entities/notification.entity';
import { Wallet } from 'src/common/entities/wallet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Contract, Milestone, Notification, Wallet])],
  controllers: [ContractsController],
  providers: [ContractsService, NotificationsService, NotificationSocketHandler],
  exports: [ContractsService],
})
export class ContractsModule {}
