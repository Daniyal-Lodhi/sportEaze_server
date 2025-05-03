import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { LocalAuthModule } from "src/modules/auth/local-auth/local-auth.module";
import { JwtModule } from "@nestjs/jwt";
import { NetworkService } from "./network.service";
import { NetworkController } from "./network.controller";
import { Connection } from "./entities/connection.entity";
import { Followers } from "./entities/follower.entity";
import { NetworkSocketHandler } from "./network.socket.handler";
import { NotificationsService } from "src/modules/notifications/notifications.service";
import { Notification } from "src/modules/notifications/entities/notification.entity";
import { NotificationSocketHandler } from "src/modules/notifications/notification.socket.handler";

@Module({
  imports: [
    TypeOrmModule.forFeature([User,Connection,Followers, Notification]),
    LocalAuthModule,
    JwtModule,
  ],
  controllers: [NetworkController],
  providers: [NetworkService, NetworkSocketHandler, NotificationsService, NotificationSocketHandler],
  exports: [NetworkService, NetworkSocketHandler]
})
export class NetworkModule {}
