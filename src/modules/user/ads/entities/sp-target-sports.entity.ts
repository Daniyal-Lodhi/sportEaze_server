import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
  } from "typeorm";
  import { SponsoredPost } from "./sponsored-post.entity";
import { Sport } from "src/common/enums/sport/sport.enum";
  
  @Entity("SponsoredPostTargetSports")
  export class SponsoredPostTargetSport {
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @Column({ type: "uuid" })
    sponsoredPostId: string;
  
    @ManyToOne(() => SponsoredPost, (post) => post.targetSports, {
      onDelete: "CASCADE",
    })
    @JoinColumn({ name: "sponsoredPostId" })
    sponsoredPost: SponsoredPost;
  
    @Column({ type: "enum",enum:Sport })
    sport: Sport;
  
  }
  