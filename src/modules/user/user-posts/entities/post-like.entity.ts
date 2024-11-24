import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserPost } from './user-post.entity';
import { User } from '../../entities/user.entity';
import { ReactTypeEnum } from 'src/common/enums/user-posts.enum';

@Entity('post_likes')
export class PostLikes {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false }) // Separate userId column
  userId: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'userId' }) // Match foreign key column
  user: User;

  @Column({ type: 'uuid', nullable: false }) // Separate postId column
  postId: string;

  @ManyToOne(() => UserPost, (post) => post.likes)
  @JoinColumn({ name: 'postId' }) // Match foreign key column
  post: UserPost;

  @Column({ default: false })
  unLiked?: boolean;

  @Column({ type: 'enum', enum: ReactTypeEnum, default: ReactTypeEnum.LIKE })
  reactType: ReactTypeEnum;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
