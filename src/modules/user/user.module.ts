import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { LocalAuthModule } from "../auth/local-auth/local-auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { LocalAuthService } from "../auth/local-auth/local-auth.service";
import { JwtModule } from "@nestjs/jwt";
import { PlayerModule } from "./player/player.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    LocalAuthModule,
    JwtModule,
    PlayerModule,
  ],
  controllers: [UserController],
  providers: [UserService, LocalAuthService],
})
export class UserModule {}
