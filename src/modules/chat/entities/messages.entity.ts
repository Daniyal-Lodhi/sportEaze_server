import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from "typeorm";
import { Chat } from "./chat.entity";
import { User } from "src/modules/user/entities/user.entity";

@Entity("Messages")
export class Message {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  content: string;

  @ManyToOne(() => Chat)
  @JoinColumn({ name: "chatId" })
  chat: Chat;

  @ManyToOne(() => User)
  @JoinColumn({ name: "senderId" })
  sender: User;

  @CreateDateColumn()
  sentAt: Date;
}
