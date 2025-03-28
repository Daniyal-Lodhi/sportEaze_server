import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "src/modules/user/entities/user.entity";
import { ConnectionStatus } from "src/common/enums/network/network.enum";


@Entity("Connections") // Specifies the table name as 'connections'
export class Connection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: "uuid" })
  senderId: string;

  @Column({ type: "uuid" })
  receiverId: string;

  @OneToOne(() => User)
  @JoinColumn({ name: "senderId" })
  sender: User;

  @OneToOne(() => User)
  @JoinColumn({ name: "receiverId" })
  receiver: User;

  @Column({
    type: "enum",
    enum: ConnectionStatus,
    default: ConnectionStatus.PENDING,
  })
  status: ConnectionStatus;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
