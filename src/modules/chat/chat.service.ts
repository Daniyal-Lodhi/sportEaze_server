import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { Message } from './entities/messages.entity';
import { Chat } from './entities/chat.entity';
import { CreateChatDto } from './dto/create-chat.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,

    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async sendMessageBetweenUsers(
    senderId: string,
    createChatDto: CreateChatDto
  ): Promise<Message> {

    console.log(1);

    const sender = await this.userRepository.findOne({ where: { id: senderId } });
    const recipient = await this.userRepository.findOne({ where: { id: createChatDto.recipientId } });
  
    if (!sender || !recipient) {
      throw new Error('Sender or recipient not found');
    }
  
    // Check for existing chat between the two users (regardless of order)
    let chat = await this.chatRepository.findOne({
      where: [
        { user1: { id: senderId }, user2: { id: createChatDto.recipientId } },
        { user1: { id: createChatDto.recipientId }, user2: { id: senderId } },
      ],
    });
  
    // If chat doesn't exist, create a new one
    if (!chat) {
      chat = this.chatRepository.create({
        user1: sender,
        user2: recipient,
      });
      chat = await this.chatRepository.save(chat);
    }

    // Corrected this line
    const { content } = createChatDto;
    const message = this.messageRepository.create({ content, chat, sender });
    
    return await this.messageRepository.save(message);
  }

  async getMessagesByChat(chatId: string): Promise<Message[]> {
    return await this.messageRepository.find({
      where: { chat: { id: chatId } },
      order: { sentAt: 'ASC' },
    });
  }

  async getUserChats(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
  
    const msgs = await this.messageRepository.find({
      where: [
        { chat: { user1: { id: userId } } },
        { chat: { user2: { id: userId } } },
      ],
      relations: ["chat", "chat.user1", "chat.user2", "sender"],
      order: { sentAt: "DESC" }, // important to get latest messages first
    });
  
    const seenChats = new Set();
    const latestChats = [];
  
    for (const msg of msgs) {
      const chatId = msg.chat.id;
      if (seenChats.has(chatId)) continue; // skip duplicates
  
      seenChats.add(chatId);
  
      const otherUser = msg.chat.user1.id === userId ? msg.chat.user2 : msg.chat.user1;
  
      latestChats.push({
        chatId: chatId,
        user: {
          id: otherUser?.id,
          profilePicUrl: otherUser?.profilePicUrl,
          fullName: otherUser?.fullName,
          username: otherUser?.username,
          userType: otherUser?.userType,
        },
        message: {
          content: msg.content,
          senderId: msg.sender.id,
          sentAt: msg.sentAt,
        },
      });
    }
  
    return latestChats;
  }
}
  