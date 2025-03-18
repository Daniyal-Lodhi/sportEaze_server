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
  Delete,
} from "@nestjs/common";
import { PlayerService } from "./player.service";
import { UpdatePlayerDto } from "./dto/update-player.dto";
import { JwtAuthGuard } from "../../auth/local-auth/jwt-auth.guard";
import { GetPlayerDto } from "./dto/get-player.dto";
import { AddSocialMediaLinkDto } from "./dto/add-social-media-link.dto";
import { DeleteSocialMediaDto } from "./dto/delete-socia-media-links.dto";
import { ApiBearerAuth } from "@nestjs/swagger";
import { RegisterPlayerDto } from "./dto/register-player.dto";

@Controller("api/user/player")
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async becomePlayer(@Body() registerPlayerDto: RegisterPlayerDto, @Request() req) {
    if (!req.user || !req.user.id) {
      throw new UnauthorizedException("Invalid user credentials");
    }

    const player = await this.playerService.RegisterPlayer(req.user.id, registerPlayerDto);

    if (!player) {
      throw new BadRequestException("Failed to change user type to player");
    }

    return {
      success: true,
      message: "This user is now a player",
      player,
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

      res.status(200).json(updatedPlayer);
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

  @Patch("/social-media-links")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async AddSocialMediaLink(
    @Request() req,
    @Response() res,
    @Body() addSocialMediaLinkDto: AddSocialMediaLinkDto,
  ) {
    try {
      if (!req.user || !req.user.id) {
        throw new UnauthorizedException("Invalid user credentials");
      }

      const { id } = req.user;

      const updatedPlayer: GetPlayerDto =
        await this.playerService.addPlayerLink(id, addSocialMediaLinkDto);

      if (!updatedPlayer) {
        throw new BadRequestException("Cannot add the link");
      }

      res.status(200).json({ success: true, updatedPlayer });
    } catch (error) {
      console.error("[ADD_SOCIAL_MEDIA_LINKS_CTRL]:", error);
      throw new HttpException(
        error.message || "Internal Server Error",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete("/social-media-links")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async deleteSocialMediaLink(
    @Request() req,
    @Response() res,
    @Body() deleteSocialMediaLinkDto: DeleteSocialMediaDto,
  ) {
    try {
      const isEmpty =
        !deleteSocialMediaLinkDto.deleteFbLink &&
        !deleteSocialMediaLinkDto.deleteInstaLink &&
        !deleteSocialMediaLinkDto.deleteXLink;

      if (isEmpty) {
        throw new BadRequestException("No social media link provided");
      }

      if (!req.user || !req.user.id) {
        throw new UnauthorizedException("Invalid user credentials");
      }

      const { id } = req.user;

      const result: string = await this.playerService.deletePlayerLink(
        id,
        deleteSocialMediaLinkDto,
      );

      if (!result) {
        throw new BadRequestException("Cannot delete the link");
      }

      res.status(200).json({ success: true, message: result });
    } catch (error) {
      console.error("[ADD_SOCIAL_MEDIA_LINKS_CTRL]:", error);
      throw new HttpException(
        error.message || "Internal Server Error",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get("/social-media-links")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getSocialMediaLinks(@Request() req, @Response() res) {
    try {
      if (!req.user || !req.user.id) {
        throw new UnauthorizedException("Invalid user credentials");
      }

      const { id } = req.user;

      const result: AddSocialMediaLinkDto =
        await this.playerService.getPlayerLink(id);

      res.status(200).json({ success: true, result });
    } catch (error) {
      console.error("[ADD_SOCIAL_MEDIA_LINKS_CTRL]:", error);
      throw new HttpException(
        error.message || "Internal Server Error",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
