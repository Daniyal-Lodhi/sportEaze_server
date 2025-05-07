import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationRedirectType, NotificationType } from 'src/common/enums/notifications/notifications.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationSocketHandler } from './notification.socket.handler';
import { formatToLocalDateTime } from 'src/common/utils/dayjs.helper';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,
    private readonly notificationSocketHandler: NotificationSocketHandler,
  ) {}

  private generateMessage(type: NotificationType, actorName: string): string {
    const messages = {
      [NotificationType.CONNECTION_REQUEST]: `${actorName} has sent you a connection request`,
      [NotificationType.CONNECTION_ACCEPTED]: `${actorName} has accepted your connection request`,
      [NotificationType.FOLLOW]: `${actorName} has started following you`,
    };
    return messages[type] || '';
  }

  private getRedirectType(type: NotificationType): NotificationRedirectType {
    const redirectTypes = {
      [NotificationType.CONNECTION_REQUEST]: NotificationRedirectType.USER_ID,
      [NotificationType.CONNECTION_ACCEPTED]: NotificationRedirectType.USER_ID,
      [NotificationType.FOLLOW]: NotificationRedirectType.USER_ID,
    };
    return redirectTypes[type] || NotificationRedirectType.USER_ID;
  }

  async create(actorId: string, { type, recipientUserId }: CreateNotificationDto): Promise<any> {
    const [recipientUser, actorUser] = await Promise.all([
      this.userRepo.findOne({ where: { id: recipientUserId } }),
      this.userRepo.findOne({ where: { id: actorId } }),
    ]);

    if (!recipientUser || !actorUser) {
      throw new NotFoundException('One or both users not found');
    }

    const message = this.generateMessage(type, actorUser.fullName);

    const notification = this.notificationRepo.create({
      type,
      redirect: actorId,
      actorUser,
      recipientUser,
      message,
      isRead: false,
    });

    await this.notificationRepo.save(notification);

    const unreadCount = await this.notificationRepo.count({
      where: { recipientUser: { id: recipientUserId }, isRead: false },
    });

    const result = {
      notifications: [{
        id: notification.id,
        type: notification.type,
        redirect:
        {
        },
        data: {
          message: notification.message,
          user: {
            id: actorUser.id,
            profilePicUrl: actorUser.profilePicUrl,
            fullName: actorUser.fullName,
            username: actorUser.username,
            UserType: actorUser.userType,
          },
          createdAt: formatToLocalDateTime(notification.createdAt),
        }
      }],
      unreadCount,
    };

    this.notificationSocketHandler.SendNotification(result, recipientUserId);
    return result;
  }

  async findAll(userId: string): Promise<any> {
    const notifications = await this.notificationRepo.find({
      where: { recipientUser: { id: userId } },
      relations: ['actorUser'],
      order: { createdAt: 'DESC' },
    });

    const unreadCount = await this.notificationRepo.count({
      where: { recipientUser: { id: userId }, isRead: false },
    });

    const result = {
      notifications: notifications.map(notification => ({
        id: notification.id,
        type: notification.type,
        redirect:{
        },
        data: {
          message: notification.message,
          user: {
            id: notification.actorUser.id,
            profilePicUrl: notification.actorUser.profilePicUrl,
            fullName: notification.actorUser.fullName,
            username: notification.actorUser.username,
            UserType: notification.actorUser.userType,
          },
          createdAt: formatToLocalDateTime(notification.createdAt),
        }
      })),
      unreadCount,
    };

    return result;
  }

  async markAsRead(userId: string): Promise<any> {
    const notifications = await this.notificationRepo.find({
      where: { recipientUser: { id: userId }, isRead: false },
    });

    if (notifications.length === 0) {
      return { message: 'No unread notifications' };
    }

    await this.notificationRepo.update(
      { recipientUser: { id: userId }, isRead: false },
      { isRead: true },
    );

    return { message: 'Notifications marked as read' };
  }
}