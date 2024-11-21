import { Player } from "src/modules/user/player/entities/player.entity";
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity("Sports")
export class Sport {
    @PrimaryGeneratedColumn("increment")
    id?: number;

    @Column({ type: "varchar", length: 25, nullable: false, unique: true})
    name: string

    @OneToMany(() => Player, (player) => player.preferredSport)
    player: Player[];
}