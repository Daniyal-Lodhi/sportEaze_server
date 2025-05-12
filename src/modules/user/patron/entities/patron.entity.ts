import { User } from "src/modules/user/entities/user.entity";
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from "typeorm";
import { PlayingLevel } from "src/common/enums/player/playing-levels.enum";
import { PatronType, FundingType, PatronAccountStatus } from "src/common/enums/patron/patron.enum";
import { Sport } from "src/common/enums/sport/sport.enum";
import { Contract } from "src/modules/contracts/entities/contract.entity";
import { Wallet } from "src/common/entities/wallet.entity";

@Entity("Patron")
export class Patron {
  @PrimaryColumn("uuid")
  id: string;

  @OneToOne(() => User, (user) => user.patron)
  @JoinColumn({ name: "id" })
  user: User;

  @Column({ type: 'enum', enum: PatronType })
  patronType: PatronType;

  @Column({ nullable: true })
  industryType?: string;

  @Column({ type: 'enum', enum: Sport, array: true })
  supportedSports?: Sport[];

  @Column({ type: 'enum', enum: PlayingLevel, array: true })
  preferredPlayerLevels: PlayingLevel[];

  @Column({ type: 'enum', enum: FundingType, array: true })
  preferredFundingTypes: FundingType[];

  @Column({ nullable: true })
  website?: string;

  @Column({ nullable: true })
  linkedIn?: string;

  @Column({ nullable: true })
  fbLink?: string;

  @Column({ nullable: true })
  xLink?: string;

  @Column({ nullable: true })
  instaLink?: string;

  @Column({type: "enum", enum: PatronAccountStatus, default: PatronAccountStatus.PENDING})
  status: PatronAccountStatus;

  // @Column({ type: "uuid", nullable: true })
  // reviewedByAdminId?: string | null;

  @Column({ type: "text", nullable: true })
  adminReviewComment?: string | null;

  @OneToMany(() => Contract, (contract) => contract.patron)
  contracts: Contract[];

  @OneToOne(() => Wallet, (wallet) => wallet.patron)
  wallet: Wallet
}
