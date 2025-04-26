import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn, BeforeInsert } from "typeorm";
import { Chat } from "./chat.entity";
import { User } from "src/modules/user/entities/user.entity";
import dayjs, { LOCAL_TZ } from "src/common/utils/dayjs.helper";

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

  @Column({ default: false })
  isRead: boolean;

  @Column()
  sentAt: Date;

  @BeforeInsert()
  setSentAt() {
    this.sentAt = dayjs().tz(LOCAL_TZ).toDate();
  }
}
