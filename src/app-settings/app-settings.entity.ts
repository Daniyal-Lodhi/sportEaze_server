import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm"

@Entity("AppSettings")
export class  AppSettings {

    @PrimaryGeneratedColumn("increment")
    id: number

    @Column({default: true})
    allowDeleteUser: boolean
    
    @Column({default: true})
    allowUpdateUser: boolean
    
    @Column({default: true})
    shouldTakeConsent: boolean
}
