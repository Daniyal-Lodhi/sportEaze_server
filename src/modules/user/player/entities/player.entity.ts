import { Achievement } from "src/common/entities/achievement.entity";
import { User } from "src/modules/user/entities/user.entity";
import {
  Check,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from "typeorm";
import { RatingAndReview } from "src/common/entities/rating-reviews.entity";
import { Sport } from "src/common/enums/sport/sport.enum";
import { PlayingLevel } from "src/common/enums/player/playing-levels.enum";
import { Contract } from "src/modules/contracts/entities/contract.entity";

@Entity("Player")
export class Player {
  @PrimaryColumn("uuid")
  id: string;

  @OneToOne(() => User, (user) => user.player)
  @JoinColumn({ name: "id" })
  user: User;
  
  @Column({ type: "enum", enum: Sport, nullable: false })
  primarySport: Sport;

  @Column({ type: "enum", enum: Sport, array: true, nullable: true })
  secondarySports: Sport[];

  @Column({ type: "enum", enum: PlayingLevel, nullable: false })
  playingLevel: PlayingLevel;

  // @OneToMany(() => Achievement, (achievement) => achievement.player)
  // achievements: Achievement[];
  
  @Column({ type: "varchar", length: 50, nullable: true })
  currentTeam: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  coachName: string
  
  @Column({ type: "varchar", length: 200, nullable: true })
  playerBio: string;

  @Column({ type: "varchar", length: 200, nullable: true })
  trainingLocation: string;
  
  // ADD HIGHLIGHT VIDEO
  
  @Column({ type: "varchar", length: 255, nullable: true })
  fbLink: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  instaLink: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  xLink: string;

  @Column()
  availableForSponsorship: boolean;

  @OneToMany(() => Contract, (contract) => contract.player)
  contracts: Contract[];
  
  @OneToMany(() => RatingAndReview, (ratingAndReview) => ratingAndReview.player)
  ratingAndReviews: RatingAndReview[];
}