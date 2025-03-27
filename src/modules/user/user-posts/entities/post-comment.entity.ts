import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { UserPost } from "./user-post.entity";
import { User } from "../../entities/user.entity";

@Entity("postComments")
export class Comment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", nullable: false })
  userId: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;


  @Column({ type: "uuid", nullable: false })
  postId: string;

  @ManyToOne(() => UserPost, (post) => post.comments, { onDelete: "CASCADE" })
  @JoinColumn({ name: "postId" })
  post: UserPost;

  @Column("text")
  content: string;

  @ManyToOne(() => Comment, (comment) => comment.replies, { nullable: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "parentCommentId" })
  parentComment: Comment | null;

  @OneToMany(() => Comment, (comment) => comment.parentComment)
  replies: Comment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
