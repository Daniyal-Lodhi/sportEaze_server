import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { UserPost } from './user-post.entity';
import { User } from '../../entities/user.entity';
  
  @Entity('comments')
  export class Comment {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ManyToOne(()=>User)
    @JoinColumn()
    userId:string

    @ManyToOne(() => UserPost, (post) => post.comments)
    @JoinColumn()
    postId: string;
  
    @Column('text')  
    content: string;
  
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
  }
  