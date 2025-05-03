import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Notification } from './entities/notification.entity';
import { NotificationSocketHandler } from './notification.socket.handler';

@Module({
  imports: [TypeOrmModule.forFeature([User, Notification])], // Add your entities here
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationSocketHandler],
})
export class NotificationsModule {}
