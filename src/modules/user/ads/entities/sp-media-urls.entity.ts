import { MediaType } from "src/common/enums/post/user-posts.enum";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { SponsoredPost } from "./sponsored-post.entity";

@Entity("SponsoredPostMedia")
export class SponsoredPostMedia {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "enum", enum: MediaType, nullable: false })
  mediaType: MediaType;

  @Column({ nullable: false })
  mediaLink: string;

  @Column({ nullable: true }) // Optional
  mediaThumbnail?: string;

  @Column({ nullable: false })
  mediaOrder: number;

  @Column({ type: "uuid", nullable: false })
  sponsoredPostId: string;

  @ManyToOne(() => SponsoredPost, (post) => post.media, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "sponsoredPostId" })
  sponsoredPost: SponsoredPost;
}
