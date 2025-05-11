import { Module } from "@nestjs/common";
import { PlayerService } from "./player.service";
import { PlayerController } from "./player.controller";
import { UserService } from "../../user/user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../../user/entities/user.entity";
import { Player } from "./entities/player.entity";
import { LocalAuthService } from "../../auth/local-auth/local-auth.service";
import { JwtService } from "@nestjs/jwt";
import { LocalAuthModule } from "src/modules/auth/local-auth/local-auth.module";
import { NetworkModule } from "../network/network.module";
import { Wallet } from "src/common/entities/wallet.entity";
import { EndorseDto } from "../mentor/dto/endorse.dto";
import { Endorsement } from "src/common/entities/endorsement.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Player, User, Wallet, Endorsement]), LocalAuthModule, NetworkModule],
  controllers: [PlayerController],
  providers: [PlayerService, UserService,],
})
export class PlayerModule {}
