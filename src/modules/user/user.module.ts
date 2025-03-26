import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { LocalAuthModule } from "../auth/local-auth/local-auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { LocalAuthService } from "../auth/local-auth/local-auth.service";
import { JwtModule } from "@nestjs/jwt";
import { PlayerModule } from "./player/player.module";
import { UserPostModule } from "./user-posts/user-post.module";
import { FanController } from "./fan/fan.controller";
import { PatronModule } from "./patron/patron.module";
import { NetworkModule } from "./network/network.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    LocalAuthModule,
    PlayerModule,
    PatronModule,
    UserPostModule,
    NetworkModule
  ],
  controllers: [UserController, FanController],
  providers: [UserService],
})
export class UserModule {}
