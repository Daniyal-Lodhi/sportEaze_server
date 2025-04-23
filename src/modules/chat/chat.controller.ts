import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/local-auth/jwt-auth.guard';

@Controller('/api/chat')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
  export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async sendMessage(
    @Body() createChatDto: CreateChatDto,
    @Request() req
  ) {
      return this.chatService.sendMessageBetweenUsers(req.user.id, createChatDto);
  }


  @Get('/:user2Id')
  async getMessages(@Request() req, @Param('user2Id') user2: string) {
    return this.chatService.getMessagesByUserIds(req.user.id, user2);
  }

  @Get("/user/:userId")
  async getUserChats(@Param('userId') userId: string) {
    return this.chatService.getUserChats(userId);
  }

  @Post("/read/:chatId")
  async markAsRead(@Param('chatId') chatId: string, @Request() req) {
    return this.chatService.markAsRead(chatId, req.user.id);
  }

}
