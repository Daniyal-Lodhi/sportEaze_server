import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";
import { UserPost } from "./user-post.entity";
import { PostVisibilityEnum } from "src/common/enums/user-posts.enum";
import { User } from "../../entities/user.entity";

@Entity("SharedPosts")
export class SharedPost {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  user: User;

  @ManyToOne(() => UserPost)
  @JoinColumn({ name: "originalPostId" })
  originalPost: UserPost;

  @Column({ nullable: true })
  shareMessage: string;

  @Column({
    type: "enum",
    enum: PostVisibilityEnum,
    default: PostVisibilityEnum.PUBLIC,
  })
  visibility: PostVisibilityEnum;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
