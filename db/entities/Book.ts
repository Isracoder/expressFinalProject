import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Role } from "./Role.js";
import { Genre } from "./Genre.js";
// import { User } from "../../types/users.js";
//   import bcrypt from "bcrypt";

@Entity()
export class Book extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ nullable: false, length: 200 })
  name: string;

  @ManyToMany(() => Genre, { cascade: true })
  genres: Genre[];
}
// add many to many  with Role ,
