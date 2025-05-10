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
      [NotificationType.POST_LIKED]: `${actorName} has liked your post`,
      [NotificationType.POST_COMMENTED]: `${actorName} has commented on your post`,
      [NotificationType.MSG_RECEIVED]: `${actorName} has sent you a message`,
      
    };
    return messages[type] || '';
  }

  async create(actorId: string, { type, recipientUserId }: CreateNotificationDto, redirectId?: string): Promise<any> {
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

    let redirectData = {};

    if(type === NotificationType.FOLLOW) {
      redirectData = {followerId:  actorId};
    }
    else if(type === NotificationType.POST_LIKED || type === NotificationType.POST_COMMENTED) {
      redirectData = {postId: redirectId};
    }
    else if(type === NotificationType.MSG_RECEIVED) {
      redirectData = {chatId: redirectId};
    }

    const result = {
      notifications: [{
        id: notification.id,
        type: notification.type,
        redirect: redirectData,
        data: {
          message: notification.message,
          user: {
            id: actorUser.id,
            profilePicUrl: actorUser.profilePicUrl,
            fullName: actorUser.fullName,
            username: actorUser.username,
            userType: actorUser.userType,
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
      notifications: notifications.map(notification => {
        
      let redirectData = {};
        if(notification.type === NotificationType.FOLLOW) {
          redirectData = {followerId:  notification.actorUser.id};
        }
        
        return {
        id: notification.id,
        type: notification.type,
        redirect: redirectData,
        data: {
          message: notification.message,
          user: {
            id: notification.actorUser.id,
            profilePicUrl: notification.actorUser.profilePicUrl,
            fullName: notification.actorUser.fullName,
            username: notification.actorUser.username,
            userType: notification.actorUser.userType,
          },
          createdAt: formatToLocalDateTime(notification.createdAt),
        }
      }
    }),
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