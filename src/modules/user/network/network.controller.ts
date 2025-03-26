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
import { RespondToConnectionRequestDto, SendConnectionRequestDto } from "./dto/network.dto";

@Controller("api/network")
export class NetworkController {
  constructor(private readonly networkService: NetworkService) {}

  // 1️⃣ Send a connection request
  @Post("connect")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async sendConnectionRequest(@Request() req, @Body() body : SendConnectionRequestDto) {
    if (!req.user || !req.user.id) {
      throw new UnauthorizedException("Invalid user credentials");
    }

    return this.networkService.sendConnectionRequest(req.user.id, body.receiverId);
  }

  // 2️⃣ Accept or reject a connection request
  @Patch("connect/respond")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async respondToConnectionRequest(
    @Request() req,
    @Body() body: RespondToConnectionRequestDto
  ) {
    if (!req.user || !req.user.id) {
      throw new UnauthorizedException("Invalid user credentials");
    }

    return this.networkService.respondToConnectionRequest(body.requesterId, req.user.id, body.action);
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

  @Get("connect/get-all-connections")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getApprovedConnections(@Request() req) {
    if (!req.user || !req.user.id) {
      throw new UnauthorizedException("Invalid user credentials");
    }

    const connections = await this.networkService.getApprovedConnections(req.user.id);

    return {connections,success:true};
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

  @Get("get-all-followers")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getFollowers(@Request() req) {
    const userId = req.user.id;
    const followers = await this.networkService.getFollowers(userId);

    if (!followers || followers.length === 0) {
      throw new NotFoundException("No followers found.");
    }

    return { followers, count: followers.length,success:true };
  }
}
