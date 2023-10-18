import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import { Role } from "./Role.js";
import { Genre } from "./Genre.js";
import { Library } from "./Library.js";
import { User } from "./User.js";
import { Review } from "./Review.js";
import { Book } from "./Book.js";

@Entity()
export class Friend extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  // @ManyToOne(()=> User)
  friend1: User;

  // @Column()
  // friend
}
// consider adding a due date column ,
// or a column that is either a due date (for free libraries) or num of copies (for bookstores)
