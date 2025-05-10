import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Contract } from "./contract.entity";

@Entity("Milestones")
export class Milestone {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    description: string;

    @Column("decimal")
    amount: number;

    @ManyToOne(() => Contract, contract => contract.milestones, { onDelete: "CASCADE" })
    @JoinColumn({ name: "contractId" })
    contract: Contract;
}
