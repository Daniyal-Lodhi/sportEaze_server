import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { User } from "src/modules/user/entities/user.entity";


@Entity("Followers") // Specifies the table name as 'connections'
export class Followers {
  @PrimaryColumn("uuid")
  id: string;

  @Column({ type: "uuid" })
  playerId: string;

  @Column({ type: "uuid" })
  followerId: string;

  @OneToOne(() => User)
  @JoinColumn({ name: "playerId" })
  player: User;

  @OneToOne(() => User)
  @JoinColumn({ name: "followerId" })
  follower: User;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
