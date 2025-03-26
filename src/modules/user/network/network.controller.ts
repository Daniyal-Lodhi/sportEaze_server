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
  UnauthorizedException,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiParam } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../auth/local-auth/jwt-auth.guard";
import { NetworkService } from "../network/network.service";
import { SendConnectionRequestDto } from "./dto/send-connection-request.dto";
import { RespondConnectionRequestDto } from "./dto/respond-connection-request.dto";
import { FollowPlayerDto } from "./dto/follow-player.dto";
import { UnfollowPlayerDto } from "./dto/unfollow-player.dto";

@ApiBearerAuth()
@Controller("api/network")
export class NetworkController {
  constructor(private readonly networkService: NetworkService) {}

  // 1️⃣ Send a connection request
  @Post("connect")
  @UseGuards(JwtAuthGuard)
  async sendConnectionRequest(@Request() req, @Body() body: SendConnectionRequestDto) {
    if (!req.user || !req.user.id) {
      throw new UnauthorizedException("Invalid user credentials");
    }

    return this.networkService.sendConnectionRequest(req.user.id, body.receiverId);
  }

  // 2️⃣ Accept or reject a connection request
  @Patch("connect/respond")
  @UseGuards(JwtAuthGuard)
  async respondToConnectionRequest(@Request() req, @Body() body: RespondConnectionRequestDto) {
    if (!req.user || !req.user.id) {
      throw new UnauthorizedException("Invalid user credentials");
    }

    return this.networkService.respondToConnectionRequest(body.requesterId, req.user.id, body.action);
  }

  // 3️⃣ Get all pending connection requests
  @Get("connect/pending")
  @UseGuards(JwtAuthGuard)
  async getPendingRequests(@Request() req) {
    if (!req.user || !req.user.id) {
      throw new UnauthorizedException("Invalid user credentials");
    }

    return this.networkService.getPendingConnectionRequests(req.user.id);
  }

  // 4️⃣ Follow a player
  @Post("follow/:playerId")
  @UseGuards(JwtAuthGuard)
  async followPlayer(@Request() req, @Body() body: FollowPlayerDto) {
    if (!req.user || !req.user.id) {
      throw new UnauthorizedException("Invalid user credentials");
    }

    return this.networkService.followPlayer(req.user.id, body.playerId);
  }

  // 5️⃣ Unfollow a player
  @Delete("unfollow/:playerId")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async unfollowPlayer(@Request() req, @Body() body: UnfollowPlayerDto) {
    if (!req.user || !req.user.id) {
      throw new UnauthorizedException("Invalid user credentials");
    }

    return this.networkService.unfollowPlayer(req.user.id, body.playerId);
  }
}
