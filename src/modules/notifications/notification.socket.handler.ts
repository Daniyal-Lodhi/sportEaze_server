// chat.socket.handler.ts
import { Injectable } from '@nestjs/common';
import { socketClients } from '../socket/socket.gateway';
import { NOTIFICATION } from 'src/common/consts/socket-events';

@Injectable()
export class NotificationSocketHandler {
    SendNotification(notification: any) {
        const receiverSocket = socketClients.get(notification.userId);

        if (receiverSocket) {
            receiverSocket.emit(NOTIFICATION, notification);
        } else {
            console.log(`Receiver ${notification.userId} not connected`);
        }
    }
}
