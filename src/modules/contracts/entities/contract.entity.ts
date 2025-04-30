import dayjs, { LOCAL_TZ } from "src/common/utils/dayjs.helper";
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Milestone } from "./milestones.entity";
import { ContractStatus } from "src/common/enums/contracts/contracts.enum";
import { Patron } from "src/modules/user/patron/entities/patron.entity";
import { Player } from "src/modules/user/player/entities/player.entity";

@Entity("Contracts")
export class Contract {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar", length: 255 })
    description: string;

    @Column()
    totalAmount: number;

    @Column()
    startDate: Date;

    @Column()
    endDate: Date;

    @OneToMany(() => Milestone, milestone => milestone.contract)
    milestones: Milestone[];

    status: ContractStatus;

    @BeforeInsert()
    async setStartDate() {
        this.startDate = dayjs().tz(LOCAL_TZ).toDate();
    }

    @ManyToOne(() => Patron, patron => patron.contracts)
    @JoinColumn({ name: "patronId" })
    patron: Patron;

    @ManyToOne(() => Player, player => player.contracts)
    @JoinColumn({ name: "playerId" })
    player: Player;
}