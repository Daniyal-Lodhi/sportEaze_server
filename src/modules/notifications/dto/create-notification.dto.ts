import { IsEnum, IsString, IsUUID, IsBoolean, IsNotEmpty } from 'class-validator';
import { NotificationType } from 'src/common/enums/notifications/notifications.enum';
import { UserType } from 'src/common/enums/user/user-type.enum';

export class CreateNotificationDto {
  @IsEnum(NotificationType)
  type: NotificationType;

  // Recipient (user receiving the notification)
  @IsUUID()
  recipientUserId: string;
}
