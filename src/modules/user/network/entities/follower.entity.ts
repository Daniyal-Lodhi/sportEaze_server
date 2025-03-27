import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Unique,
  JoinColumn
} from "typeorm";
import { User } from "src/modules/user/entities/user.entity";

@Entity("followers")
@Unique(["playerId", "followerId"]) // Ensures a user cannot follow the same player twice
export class Follower {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid" })
  playerId: string;

  @Column({ type: "uuid" })
  followerId: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" }) 
  @JoinColumn({ name: "playerId" })
  player: User;

  @ManyToOne(() => User, { onDelete: "CASCADE" }) 
  @JoinColumn({ name: "followerId" })
  follower: User;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
