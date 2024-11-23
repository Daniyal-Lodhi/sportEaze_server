import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToOne,
    JoinColumn,
   } from 'typeorm';
import { User } from '../../entities/user.entity';
import { PostLikes } from './post-like.entity';
import { SharedPost } from './shared-post.entity';
import { Comment } from './post-comment.entity';
import { PostVisibilityEnum } from 'src/common/enums/user-posts.enum';
import { PostMedia } from './post-media.entity';
 
  
  @Entity('posts')
  export class UserPost {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({type: "uuid", nullable: false})
    userId: string

    @ManyToOne(() => User) // Relationship to User entity
    @JoinColumn({name: "userId"})
  
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
  
    @OneToMany(() => PostMedia, (PostMedia) => PostMedia.post)
    media: PostMedia[];
  
    @OneToMany(() => PostLikes, (like) => like)
    likes: PostLikes[];
  
    @OneToMany(() => Comment, (comment) => comment)
    comments: Comment[];
  }
   