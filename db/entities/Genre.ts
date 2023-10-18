import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Book } from "./Book.js";
import { User } from "./User.js";
//   import { Permission } from "./Permission.js";
// import { User } from "../../types/users.js";
//   import bcrypt from "bcrypt";

@Entity()
export class Genre extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({
    unique: true,
  })
  name: string;

  @ManyToMany(() => Book, (book) => book.genres)
  @JoinTable({
    // name: "BookGenres",
  })
  books: Book[];
}
// add many to many  with user      --complete
// , many to many with permission   -- complete
