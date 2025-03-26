import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Param,
  Request,
  UseGuards,
  HttpException,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
} from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../auth/local-auth/jwt-auth.guard";
import { NetworkService } from "../network/network.service";
import { ConnectionReqResponse } from "src/common/enums/network/network.enum";

@Controller("api/network")
export class NetworkController {
  constructor(private readonly networkService: NetworkService) {}

  // 1️⃣ Send a connection request
  @Post("connect")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async sendConnectionRequest(@Request() req, @Body("receiverId") receiverId: string) {
    if (!req.user || !req.user.id) {
      throw new UnauthorizedException("Invalid user credentials");
    }

    return this.networkService.sendConnectionRequest(req.user.id, receiverId);
  }

  // 2️⃣ Accept or reject a connection request
  @Patch("connect/respond")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async respondToConnectionRequest(
    @Request() req,
    @Body("requesterId") requesterId: string,
    @Body("action") action: ConnectionReqResponse,
  ) {
    if (!req.user || !req.user.id) {
      throw new UnauthorizedException("Invalid user credentials");
    }

    return this.networkService.respondToConnectionRequest(requesterId, req.user.id, action);
  }

  // 3️⃣ Get all pending connection requests
  @Get("connect/pending")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getPendingRequests(@Request() req) {
    if (!req.user || !req.user.id) {
      throw new UnauthorizedException("Invalid user credentials");
    }

    return this.networkService.getPendingConnectionRequests(req.user.id);
  }

  // 4️⃣ Follow a player
  @Post("follow/:playerId")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async followPlayer(@Request() req, @Param("playerId") playerId: string) {
    if (!req.user || !req.user.id) {
      throw new UnauthorizedException("Invalid user credentials");
    }

    return this.networkService.followPlayer(req.user.id, playerId);
  }

  // 5️⃣ Unfollow a player
  @Delete("unfollow/:playerId")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async unfollowPlayer(@Request() req, @Param("playerId") playerId: string) {
    if (!req.user || !req.user.id) {
      throw new UnauthorizedException("Invalid user credentials");
    }

    return this.networkService.unfollowPlayer(req.user.id, playerId);
  }
}
