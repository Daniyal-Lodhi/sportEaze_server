import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { UserPost } from "./user-post.entity";
import { User } from "../../entities/user.entity";

@Entity("comments")
export class Comment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", nullable: false })
  userId: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: "userId" })
  user: User;

  @Column({ type: "uuid", nullable: false }) // Separate postId column
  postId: string;

  @ManyToOne(() => UserPost, (post) => post.comments)
  @JoinColumn({ name: "postId" }) // Match foreign key column
  post: UserPost;

  @Column("text")
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
