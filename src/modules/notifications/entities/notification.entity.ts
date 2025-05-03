import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { NotificationType } from "src/common/enums/notifications/notifications.enum";
import { UserType } from "src/common/enums/user/user-type.enum";
import { User } from "src/modules/user/entities/user.entity";

@Entity("notifications")
export class Notification {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "enum", enum: NotificationType })
    type: NotificationType;

    @Column({ type: "uuid" })
    redirect: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: "actorUserId" })
    actorUser: User;
    
    @ManyToOne(() => User)
    @JoinColumn({ name: "recipientUserId" })
    recipientUser: User;
    
    @Column()
    message: string;

    @Column({ default: false })
    isRead: boolean;
}
