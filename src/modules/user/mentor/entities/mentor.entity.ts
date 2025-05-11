import { PrimaryColumn, OneToOne, JoinColumn, Column, CreateDateColumn, Entity, UpdateDateColumn, OneToMany } from "typeorm";
import { User } from "../../entities/user.entity";
import { Sport } from "src/common/enums/sport/sport.enum";
import { MentorRole } from "src/common/enums/mentor/mentor.enum";
import { Endorsement } from "src/common/entities/endorsement.entity";

@Entity("mentors")
export class Mentor{
    @PrimaryColumn("uuid")
    id: string;

    @OneToOne(() => User, (user) => user.patron)
    @JoinColumn({ name: "id" })
    user: User;

  
  @Column({ type: "enum", enum: MentorRole })
  role: MentorRole;

  @Column({ type: "enum", enum: Sport, array: true })
  sportInterests: Sport[];

  @Column({ type: "enum", enum: Sport, nullable: true })
  primarySport: Sport;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  yearsOfExperience: number;

  @Column({ length: 255, nullable: true })
  currentAffiliation?: string;

  @Column({ nullable: true })
  website?: string;

  @Column({ nullable: true })
  linkedIn?: string;

  @Column({ nullable: true })
  fbLink?: string;

  @Column({ nullable: true })
  xLink?: string;

  @Column({ nullable: true })
  instaLink?: string;

  @Column({type: "text", array: true, nullable: true })
  verificationDocuments?: string[]; 

  @OneToMany(() => Endorsement, (endorsement) => endorsement.mentor)
  endorsements: Endorsement[];
}