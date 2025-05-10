import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("Wallets")
export class Wallet {

    @PrimaryGeneratedColumn("uuid")
    id: string; // UUID for the wallet

    @Column()
    total: number;

    @Column()
    pending: number;
}
