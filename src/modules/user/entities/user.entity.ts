import { GenderType } from "src/common/enums/user/gender-type.enum";
import { UserType } from "src/common/enums/user/user-type.enum";
import { Player } from "src/modules/user/player/entities/player.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from "typeorm";
import { UserPost } from "../user-posts/entities/user-post.entity";
import { SharedPost } from "../user-posts/entities/shared-post.entity";
import { Sport } from "src/common/enums/sport/sport.enum";
import { Patron } from "../patron/entities/patron.entity";
import { DEFAULT_FACTORY_CLASS_METHOD_KEY } from "@nestjs/common/module-utils/constants";
import { DEFAULT_USER_PROFILE_PIC_URL } from "src/common/consts/user-const";
import { Mentor } from "../mentor/entities/mentor.entity";

@Entity("Users") // Specifies the table name as 'users'
export class User {
  @PrimaryGeneratedColumn("uuid") // Auto-generates a unique ID for each user
  id?: string;

  @Column({ type: "varchar", unique: true, length: 150 })
  email: string; // Required

  @Column({ type: "varchar", length: 255, select: false })
  password: string; // Required
  
  @Column({ type: "varchar", nullable: false, default: DEFAULT_USER_PROFILE_PIC_URL })
  profilePicUrl?: string;


  @Column({ type: "varchar", length: 100, nullable: true })
  fullName?: string;

  @Column({
    type: "varchar",
    length: 100,
    nullable: true,
    unique: true,
    transformer: {
      to: (value: string | null) => value?.toLowerCase() || null,
      from: (value: string | null) => value,
    },
  })
  username?: string;

  @Column({ type: "date", nullable: true })
  dob?: Date;
  
  @Column({ type: "enum", enum: GenderType, nullable: true })
  gender?: GenderType;
  
  @Column({ type: "enum", array: true, enum: Sport, nullable: true })
  sportInterests?: Sport[];

  @Column({ type: "enum", enum: UserType, nullable: true, default: null })
  userType?: UserType;
  
  @Column({ type: "boolean", default: false, nullable: true })
  deleted?: boolean;
  
  @CreateDateColumn()
  createdAt?: Date;
  
  @UpdateDateColumn()
  updatedAt?: Date;
  
  @OneToOne(() => Player, (player) => player.user)
  player: Player;

  @OneToOne(() => Patron, (patron) => patron.user)
  patron: Patron;

  @OneToOne(() => Mentor, (mentor) => mentor.user)
  mentor: Mentor;
  
  @OneToMany(() => UserPost, (post) => post.user) // Establish a one-to-many relationship with posts
  posts: UserPost[]; // A user can have multiple posts
  
  @OneToMany(() => SharedPost, (sharedPost) => sharedPost.user) // Establish a one-to-many relationship with posts
  sharedPosts: SharedPost[]; // A user can have multiple shared posts







  // @Column({ type: "varchar", length: 100, nullable: true })
  // city?: string;

  // @Column({ type: "varchar", length: 100, nullable: true })
  // country?: string;
}
