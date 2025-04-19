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


  @Get('/:chatId')
  async getMessages(@Param('chatId') chatId: string) {
    return this.chatService.getMessagesByChat(chatId);
  }
}
