import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ContractStatus } from "../enums/contract-status.enum";
import { Player } from "src/modules/user/player/entities/player.entity";

@Entity("Contracts")
export class Contract {
  @PrimaryGeneratedColumn("increment")
  contractId?: number;

  @ManyToOne(() => Player, (player) => player.contracts)
  @JoinColumn({ name: "playerId" })
  player: Player;

  // @ManyToOne(() => Patron, (patron) => patron.contracts)
  // @JoinColumn({ name: "patronId" })
  // patron: Patron

  @Column({ type: "varchar", length: 100, nullable: false })
  terms: string;

  @Column({ type: "date" })
  start: Date;

  @Column({ type: "date" })
  end: Date;

  @Column({ type: "enum", enum: ContractStatus, nullable: false })
  status: ContractStatus;

  @Column({ type: "boolean", default: false })
  deleted?: boolean;
}
