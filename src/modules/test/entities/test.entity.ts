import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity() // Declares the class as an entity
export class testUserEntity { 
  @PrimaryGeneratedColumn('uuid') // Auto-incremented primary key
  id: number;

  @Column({type:'varchar',length:50}) // Specifies a regular column
  name: string;

  @Column()
  age: number;
}