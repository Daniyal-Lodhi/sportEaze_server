import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  Response,
  Patch,
  UseGuards,
  HttpException,
  HttpStatus,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
  Param,
  Optional,
} from "@nestjs/common";
import { PlayerService } from "./player.service";
import { UpdatePlayerDto } from "./dto/update-player.dto";
import { JwtAuthGuard, OptionalJwtAuthGuard } from "../../auth/local-auth/jwt-auth.guard";
import { GetPlayerDto } from "./dto/get-player.dto";
import { ApiBearerAuth } from "@nestjs/swagger";
import { RegisterPlayerDto } from "./dto/register-player.dto";
import { ComparePlayersDto } from "./dto/compare-players.dto";

@Controller("api/user/player")
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async becomePlayer(
    @Body() registerPlayerDto: RegisterPlayerDto,
    @Request() req,
  ) {
    if (!req.user || !req.user.id) {
      throw new UnauthorizedException("Invalid user credentials");
    }

    const player = await this.playerService.RegisterPlayer(
      req.user.id,
      registerPlayerDto,
    );

    if (!player) {
      throw new BadRequestException("Failed to change user type to player");
    }

    return {
      user: player,
      success: true,
      message: "This user is now a player",
    };
  }

  @Patch()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async updatePlayer(
    @Request() req,
    @Response() res,
    @Body() updatePlayerDto: UpdatePlayerDto,
  ) {
    try {
      const { id } = req.user;

      const updatedPlayer = await this.playerService.updatePlayer(
        id,
        updatePlayerDto,
      );

      res.status(200).json({ user: updatedPlayer, success: true });
    } catch (error) {
      console.error("[UPDATE_PLAYER_CTRL]:", error);
      throw new HttpException(
        error.message || "Internal Server Error",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getPlayer(@Request() req, @Response() res) {
    try {
      if (!req.user || !req.user.id) {
        throw new UnauthorizedException("Invalid user credentials");
      }

      const { id } = req.user;

      const player: GetPlayerDto = await this.playerService.getPlayer(id);

      if (!player) {
        throw new NotFoundException("Player not found");
      }

      res.status(200).json({ player, success: true });
    } catch (error) {
      console.error("[GET_PLAYER_CTRL]:", error);
      throw new HttpException(
        error.message || "Internal Server Error",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get("trending-player")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getTrendingPlayers(@Request() req, @Response() res) {
    try {
      if (!req.user || !req.user.id) {
        throw new UnauthorizedException("Invalid user credentials");
      }

      const trendingPlayers = await this.playerService.getTrendingPlayers(
        req.user.id,
      );

      res.status(200).json({
        players: trendingPlayers,
        success: true,
        message: "Trending players fetched successfully",
      });
    } catch (error) {
      console.error("[GET_TRENDING_PLAYERS_CTRL]:", error);
      throw new HttpException(
        error.message || "Internal Server Error",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get("/endorsements/:playerId")
  async getEndorsements(@Param("playerId") playerId: string) {
    return await this.playerService.getEndorsements(playerId);
  }
  catch(error) {
    console.error("[GET_ENDORSEMENTS_CTRL]:", error);
    throw new HttpException(
      error.message || "Internal Server Error",
      error.status || HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth()
  @Get("/preferred")
  async getPreferred(@Request() req) {
    return await this.playerService.getPreferred(req.user?.id);
  }

  @Post("compare")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getPlayersForComparision(
    @Body() comparePlayersDto: ComparePlayersDto,
    @Request() req,
    @Response() res,
  ) {
    try {
      if (!req.user || !req.user.id) {
        throw new UnauthorizedException("Invalid user credentials");
      }

      const playerOne = await this.playerService.getPlayerForComparision(
        comparePlayersDto.playerOneUsername,
      );

      const playerTwo = await this.playerService.getPlayerForComparision(
        comparePlayersDto.playerTwoUsername,
      );

      res.status(200).json({
        playerOne,
        playerTwo,
        success: true,
        message: "Players for comparision fetched successfully",
      });
    } catch (error) {
      console.error("[GET_PLAYERS_FOR_COMPARISION_CTRL]:", error);
      throw new HttpException(
        error.message || "Internal Server Error",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
