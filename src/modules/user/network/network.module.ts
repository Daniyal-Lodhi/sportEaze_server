import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { LocalAuthModule } from "src/modules/auth/local-auth/local-auth.module";
import { JwtModule } from "@nestjs/jwt";
import { NetworkService } from "./network.service";
import { NetworkController } from "./network.controller";
import { Connection } from "./entities/connection.entity";
import { Followers } from "./entities/follower.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([User,Connection,Followers]),
    LocalAuthModule,
    JwtModule,
  ],
  controllers: [NetworkController],
  providers: [NetworkService],
})
export class NetworkModule {}
