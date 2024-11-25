import { Player } from "src/modules/user/player/entities/player.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("Achievements")
export class Achievement {
  @PrimaryGeneratedColumn("increment") // Auto Increment Int
  id?: number;

  @Column({ type: "varchar", length: 50, nullable: false })
  title: string;

  @Column({ type: "varchar", length: 250, nullable: true })
  description: string;

  @Column({ type: "date" })
  dateAchieved: Date;

  @ManyToOne(() => Player, (player) => player.achievements)
  @JoinColumn({ name: "playerId" })
  player: Player;
}

/** Explanation:
 * This is a common entity for achievements which will be used in different tables.
 * like a player can have some achievements, and mentors can also have their own achievements
 * this table will have many to one relationship with both the players and mentors, so there will be two columns,
 * one for mentors and one for players, in a single tuple only one of them can have a value, and the other will be null
 **/
