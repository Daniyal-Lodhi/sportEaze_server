// chat.socket.handler.ts
import { Injectable } from '@nestjs/common';
import { socketClients } from '../socket/socket.gateway';
import { NOTIFICATION } from 'src/common/consts/socket-events';

@Injectable()
export class NotificationSocketHandler {
    SendNotification(notification: any, recipientUserId: string) {
        const receiverSocket = socketClients.get(recipientUserId);

        if (receiverSocket) {
            receiverSocket.emit(NOTIFICATION, notification);
        } else {
            console.log(`Receiver ${notification.userId} not connected`);
        }
    }
}
