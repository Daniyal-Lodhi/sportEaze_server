import { GenderType } from 'src/common/enums/gender-type';
import { UserType } from 'src/common/enums/user-type';
import { Player } from 'src/modules/player/entities/player.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne } from 'typeorm';

@Entity('Users') // Specifies the table name as 'users'
export class User {
    @PrimaryGeneratedColumn("uuid") // Auto-generates a unique ID for each user
    id?: string; 

    @Column({ type: 'varchar', length: 100, nullable: true })
    name?: string; 

    @Column({ type: 'varchar', unique: true, length: 150 })
    email: string; // Required

    @Column({ type: 'varchar', length: 255 })
    password: string; // Required

    @Column({ type: 'enum', enum: GenderType, nullable: true })
    gender?: GenderType; 

    @Column({ type: 'date', nullable: true })
    dob?: Date; 

    @Column({ type: 'varchar', length: 100, nullable: true })
    city?: string; 

    @Column({ type: 'varchar', length: 100, nullable: true })
    country?: string; 

    @Column({ type: 'varchar', nullable: true })
    profilePicUrl?: string; 

    @Column({ type: 'enum', enum: UserType, nullable: true })
    userType?: UserType; 

    @Column({ type: 'boolean', default: false, nullable: true })
    deleted?: boolean; 

    @CreateDateColumn()
    createdAt?: Date; 

    @UpdateDateColumn()
    updatedAt?: Date; 

    @OneToOne(() => Player, (player) => player.user)
    player: Player;
}
