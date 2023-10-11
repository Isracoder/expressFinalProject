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
import { Library } from "./Library.js";
// import { User } from "../../types/users.js";
//   import bcrypt from "bcrypt";

@Entity()
export class Book extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ nullable: false, length: 200 })
  title: string;

  @Column({})
  author: string;

  @Column({})
  ISBN: string;

  @Column({})
  ageRange: string;

  @Column({})
  pages: number;

  @Column({})
  pubYear: number;

  @Column({})
  language: string;

  @ManyToMany(() => Genre, { cascade: true })
  genres: Genre[];

  @ManyToMany(() => Library, {})
  libraries: Library[];
}
// add many to many  with Role ,
