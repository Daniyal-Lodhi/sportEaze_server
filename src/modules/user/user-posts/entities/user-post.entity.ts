import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne,
} from "typeorm";
import { User } from "../../entities/user.entity";
import { PostMedia } from "./post-media.entity";
import { PostLikes } from "./post-like.entity";
import { Comment } from "./post-comment.entity";
import { PostTypeEnum, PostVisibilityEnum } from "src/common/enums/post/user-posts.enum";
import { Contract } from "src/modules/contracts/entities/contract.entity";
import { Milestone } from "src/modules/contracts/entities/milestones.entity";

@Entity("Posts")
export class UserPost {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", nullable: false }) // Separate userId column
  userId: string;

  @ManyToOne(() => User, (user) => user.posts) // Define relationship
  @JoinColumn({ name: "userId" }) // Match foreign key column
  user: User;

  @Column("text")
  textContent: string;

  @Column({ 
    type: "enum",
    enum: PostVisibilityEnum,
    default: PostVisibilityEnum.PUBLIC,
  })
  visibility: PostVisibilityEnum;

  @Column({ default: 0 })
  shareCount: number;

  @Column({
    type: "enum",
    enum: PostTypeEnum,
    default: PostTypeEnum.TEXT
  })
  postType: PostTypeEnum;

  @CreateDateColumn()
  createdAt: Date;


  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => PostMedia, (postMedia) => postMedia.post)
  media: PostMedia[];

  @OneToMany(() => PostLikes, (like) => like.post)
  likes: PostLikes[];

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @Column({nullable: true})
  contractId?: string;
  
  @ManyToOne(() => Contract)
  @JoinColumn({ name: "contractId" })
  contract?: Contract;
  
  @Column({nullable: true})
  milestoneId?: string;

  @ManyToOne(() => Milestone)
  @JoinColumn({ name: "milestoneId" })
  milestone?: Milestone;
}
