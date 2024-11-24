import { Achievement } from "src/common/entities/achievement.entity";
import { Contract } from "src/common/entities/contract.entity";
import { Sport } from "src/common/entities/sport.entity";
import { User } from "src/modules/user/entities/user.entity";
import { Check, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { RatingAndReview } from "src/common/entities/rating-reviews.entity";

@Entity("Player")
export class Player {
    @PrimaryColumn("uuid")
    id: string;
    
    @OneToOne(() => User, (user) => user.player)
    @JoinColumn({ name: "id" })
    user: User;

    @OneToMany(() => Achievement, (achievement) => achievement.player)
    achievements: Achievement[];

    @OneToMany(() => Contract, (contract) => contract.player)
    contracts: Contract[];

    @ManyToOne(() => Sport, (sport) => sport.player)
    @JoinColumn({ name: "preferredSport" })
    preferredSport: Sport;

    @Column({type: "int", nullable: true})
    @Check("rank >= 1 AND rank <= 100")
    rank: number;

    @Column({type: "varchar", length: 25, nullable: true})
    region: string;
    
    @Column({type: "varchar", length: 25, nullable: true})
    club: string;
    
    @Column({type: "varchar", length: 255, nullable: true})
    FB_link: string;
    
    @Column({type: "varchar", length: 255, nullable: true})
    INSTA_link: string;

    @Column({type: "varchar", length: 255, nullable: true})
    X_link: string;

    @OneToMany(() => RatingAndReview, (ratingAndReview) => ratingAndReview.player )
    ratingAndReviews: RatingAndReview[]
    
    @Column({type: "varchar", length: 200, nullable: true})
    about: string;
}

// socialMedialinks: put in player table, make get, update and delete api for socialmedia links