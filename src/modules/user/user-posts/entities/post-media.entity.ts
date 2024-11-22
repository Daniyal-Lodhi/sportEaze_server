 import { MediaType } from "src/common/enums/user-posts.enum";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserPost } from "./user-post.entity";
import { Url } from "url";

@Entity('PostMedia')
export class PostMedia{

    @PrimaryGeneratedColumn('uuid')
    id:string

    @Column({type: 'enum', enum: MediaType,nullable:false})
    mediaType : MediaType

    @Column({nullable:false}) 
    mediaLink:string

    @Column({nullable:false})
    mediaOrder:number 

    @ManyToOne(() => UserPost )
    @JoinColumn() 
    postId: string;

    


}