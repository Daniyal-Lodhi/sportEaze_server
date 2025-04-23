import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    ManyToMany,
    OneToMany,
} from "typeorm";
import { User } from "../../entities/user.entity";
import { PostTypeEnum } from "src/common/enums/post/user-posts.enum";
import { SponsoredPostMedia } from "./sp-media-urls.entity";
import { SponsoredPostTargetSport } from "./sp-target-sports.entity";

@Entity("SponsoredPosts")
export class SponsoredPost {
    @PrimaryGeneratedColumn("uuid")
    id: string;


    @Column({ type: "uuid", nullable: false })
    userId: string;

    @ManyToOne(() => User, (user) => user.sponsoredPosts)
    @JoinColumn({ name: "userId" })
    user: User;

    @Column({ type: "enum",enum:PostTypeEnum })
    postType: PostTypeEnum;


    @Column("text")
    text: string;

    @OneToMany(() => SponsoredPostMedia, (media) => media.sponsoredPost, {
        cascade: true,
    })
    media: SponsoredPostMedia[];


    @Column("text")
    ctaLink: string;

    // === Targeting ===
    @Column({ type: "varchar", length: 20 })
    targetAudienceAge: string;

    @OneToMany(() => SponsoredPostTargetSport, (targetSport) => targetSport.sponsoredPost, {
        cascade: true,
    })
    targetSports: SponsoredPostTargetSport[];

    @Column({ type: "int" })
    targetReachableUsers: number;

 
    @Column({ type: "int" })
    amountToSpend: number;

    @Column({ type: "varchar", length: 10 })
    currency: string;

    // === Timestamps ===
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}
