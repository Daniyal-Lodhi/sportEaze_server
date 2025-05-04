import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationType } from 'src/common/enums/notifications/notifications.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationSocketHandler } from './notification.socket.handler';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,
    private readonly notificationSocketHandler: NotificationSocketHandler,
  ) {}

  async create(actorId: string, createNotificationDto: CreateNotificationDto): Promise<any> {
    const { type, recipientUserId } = createNotificationDto;

    const recipientUser = await this.userRepo.findOne({ where: { id: recipientUserId } });
    const actorUser = await this.userRepo.findOne({ where: { id: actorId } });

    if (!recipientUser || !actorUser) {
      throw new NotFoundException("One or both users not found");
    }

    let message = "";

    if (type === NotificationType.CONNECTION_REQUEST) {
      message = `${actorUser.fullName} has sent you a connection request`;
    }

    const notification = this.notificationRepo.create({
      type,
      redirect: actorId,
      actorUser,
      recipientUser,
      message,
      isRead: false,
    });

    await this.notificationRepo.save(notification);

    // console.log(`Notification created: ${notification}`);
    console.log(`Sending notification to user ${recipientUserId}`);
    
    const unreadCount = await this.notificationRepo.count({
      where: { recipientUser: { id : recipientUserId }, isRead: false },
    });
    
    const result = {
      notifications: [
        {
          id: notification.id,
          type: notification.type,
          redirect: notification.redirect,
          data: {
            message: notification.message,
            user: {
              id: actorUser.id,
              profilePicUrl: actorUser.profilePicUrl,
              fullName: actorUser.fullName,
              username: actorUser.username,
              UserType: actorUser.userType,      
            }
          }
        }
      ],
      unreadCount: unreadCount,
    };
    
    this.notificationSocketHandler.SendNotification(result, recipientUserId);
    console.log(result);
    return result;
  }
}
