import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    Unique,
    UpdateDateColumn,
    JoinColumn,
  } from 'typeorm';
  import { UserPost } from './user-post.entity'; 
 import { ReactTypeEnum } from 'src/common/enums/user-posts.enum';
import { User } from '../../entities/user.entity';
   
  @Entity('Postlikes')
  // @Unique(['userId', 'post'])
  export class PostLikes {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ManyToOne(()=>User)
    @JoinColumn()
    userId:string
 

    @Column({default:false})
    unLiked?:  boolean; 

    @Column({ type: 'enum', enum: ReactTypeEnum, default: ReactTypeEnum.LIKE })
    reactType: ReactTypeEnum;
  
    @ManyToOne(() => UserPost, (post) => post.likes)
    @JoinColumn()
    postId: string;
  
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
  }
  