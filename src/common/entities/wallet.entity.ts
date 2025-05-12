import { Patron } from "src/modules/user/patron/entities/patron.entity";
import { Player } from "src/modules/user/player/entities/player.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("Wallets")
export class Wallet {
    @PrimaryGeneratedColumn("uuid")
    id: string; // UUID for the wallet

    @Column({default: 0})
    cash?: number;

    @Column({default: 0, nullable: true})
    payables?: number;

    @OneToOne(() => Patron, (patron) => patron.wallet)
    @JoinColumn({ name: "patronId" })
    patron: Patron;

    @OneToOne(() => Player, (player) => player.wallet)
    @JoinColumn({ name: "playerId" })
    player: Player;
}