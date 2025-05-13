import { Mentor } from "src/modules/user/mentor/entities/mentor.entity";
import { Patron } from "src/modules/user/patron/entities/patron.entity";
import { Player } from "src/modules/user/player/entities/player.entity";
import {
  BeforeInsert,
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import dayjs, { LOCAL_TZ } from "../utils/dayjs.helper";

@Entity("Endorsements")
export class Endorsement {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @ManyToOne(() => Player, (player) => player.endorsements)
  @JoinColumn({ name: "playerId" })
  player: Player;

  @ManyToOne(() => Mentor, (mentor) => mentor.endorsements)
  @JoinColumn({ name: "mentorId" })
  mentor: Mentor;


  @Column({ type: "int", nullable: true })
  @Check("rating >= 1 AND rating <= 5")
  rating?: number;

  @Column({ type: "varchar", length: 100 })
  review: string;

  @Column()
  createdAt: Date;

  @BeforeInsert()
  setCreatedAt() {
    this.createdAt = dayjs().tz(LOCAL_TZ).toDate();
  }

}
