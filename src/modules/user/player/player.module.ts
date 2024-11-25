import { Module } from "@nestjs/common";
import { PlayerService } from "./player.service";
import { PlayerController } from "./player.controller";
import { UserService } from "../../user/user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../../user/entities/user.entity";
import { Player } from "./entities/player.entity";
import { LocalAuthService } from "../../auth/local-auth/local-auth.service";
import { JwtService } from "@nestjs/jwt";

@Module({
  imports: [TypeOrmModule.forFeature([Player, User])],
  controllers: [PlayerController],
  providers: [PlayerService, UserService, LocalAuthService, JwtService],
})
export class PlayerModule {}
