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
      [NotificationType.CONTRACT_CREATED]: `${actorName} has created a contract for you`,
      [NotificationType.CONTRACT_UPDATED]: `${actorName} has updated a contract for you`,
      [NotificationType.CONTRACT_ACCEPTED]: `${actorName} has accepted a contract`,
      [NotificationType.MILESTONE_ACHIEVED]: `${actorName} has completed a milestone. Click here to release funds`,
      [NotificationType.FUNDS_RECEIVED]: `${actorName} has released you funds for achieving a milestone`,
      [NotificationType.FUNDS_RELEASED]: `${actorName} has received funds for achieving a milestone`,
      [NotificationType.ENDORSEMENT_RECEIVED]: `${actorName} has given you an endorsement`,
    };
    return messages[type] || '';
  }

  async create(actorId: string, { type, recipientUserId }: CreateNotificationDto, redirectId: string): Promise<any> {
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
      redirect: redirectId,
      actorUser,
      recipientUser,
      message,
      isRead: false,
    });

    console.log(notification);

    await this.notificationRepo.save(notification);

    const unreadCount = await this.notificationRepo.count({
      where: { recipientUser: { id: recipientUserId }, isRead: false },
    });

    let redirectData = {};

    if(type === NotificationType.FOLLOW) {
      redirectData = {followerId:  redirectId};
    }
    else if(type === NotificationType.POST_LIKED || type === NotificationType.POST_COMMENTED) {
      redirectData = {postId: redirectId};
    }
    else if(type === NotificationType.MSG_RECEIVED) {
      redirectData = {chatId: redirectId, senderId: actorId, receiverId: recipientUserId};
    }
    else if(
      type === NotificationType.CONTRACT_CREATED  ||
      type === NotificationType.CONTRACT_UPDATED  ||
      type === NotificationType.CONTRACT_ACCEPTED ||
      type === NotificationType.MILESTONE_ACHIEVED||
      type === NotificationType.FUNDS_RELEASED    ||
      type === NotificationType.FUNDS_RECEIVED
    ) {
      redirectData = {contractId: redirectId};
    }
    else if(type === NotificationType.ENDORSEMENT_RECEIVED) {
      redirectData = {playerId: redirectId};
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
      relations: ['actorUser', "recipientUser"],
      order: { createdAt: 'DESC' },
    });

    const unreadCount = await this.notificationRepo.count({
      where: { recipientUser: { id: userId }, isRead: false },
    });

    const result = {
      notifications: notifications.map(notification => {
        console.log(notification);

        const type = notification.type;
        const actorId = notification.actorUser.id;
        const redirectId = notification.redirect;
        const recipientUserId = notification.recipientUser.id;
    let redirectData = {};

    if(type === NotificationType.FOLLOW) {
      redirectData = {followerId:  redirectId};
    }
    else if(type === NotificationType.POST_LIKED || type === NotificationType.POST_COMMENTED) {
      redirectData = {postId: redirectId};
    }
    else if(type === NotificationType.MSG_RECEIVED) {
      redirectData = {chatId: redirectId, senderId: actorId, receiverId: recipientUserId};
    }
    else if(
      type === NotificationType.CONTRACT_CREATED  ||
      type === NotificationType.CONTRACT_UPDATED  ||
      type === NotificationType.CONTRACT_ACCEPTED ||
      type === NotificationType.MILESTONE_ACHIEVED||
      type === NotificationType.FUNDS_RELEASED    ||
      type === NotificationType.FUNDS_RECEIVED
    ) {
      redirectData = {contractId: redirectId};
    }
    else if(type === NotificationType.ENDORSEMENT_RECEIVED) {
      redirectData = {playerId: redirectId};
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