import { Player } from "src/modules/user/player/entities/player.entity";
import {
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("Rating and Reviews")
export class RatingAndReview {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @ManyToOne(() => Player, (player) => player.ratingAndReviews)
  @JoinColumn({ name: "playerId" })
  player: Player;

  //TODO: Mentor

  @Column({ type: "int" })
  @Check("rating >= 1 AND rating <= 5")
  rating: number;

  @Column({ type: "varchar", length: 100 })
  review: string;
}
