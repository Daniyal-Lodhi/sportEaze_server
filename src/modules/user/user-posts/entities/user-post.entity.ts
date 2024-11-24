import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../entities/user.entity';
import { PostMedia } from './post-media.entity';
import { PostLikes } from './post-like.entity';
import { Comment } from './post-comment.entity';
import { PostVisibilityEnum } from 'src/common/enums/user-posts.enum';

@Entity('posts')
export class UserPost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false }) // Separate userId column
  userId: string;

  @ManyToOne(() => User, (user) => user.posts) // Define relationship
  @JoinColumn({ name: 'userId' }) // Match foreign key column
  user: User;

  @Column('text')
  textContent: string;

  @Column({ type: 'enum', enum: PostVisibilityEnum, default: PostVisibilityEnum.PUBLIC })
  visibility: PostVisibilityEnum;

  @Column({ default: 0 })
  shareCount: number;

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
}
