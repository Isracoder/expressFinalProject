import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Role } from "./Role.js";
import { Genre } from "./Genre.js";
import { Library } from "./Library.js";
import { User } from "./User.js";
import { Review } from "./Review.js";
import { Book } from "./Book.js";

export enum copyStatus {
  available = "available",
  unavailable = "unavailable",
  changeStatus = "changeStatus",
}

@Entity()
export class Copy extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @ManyToOne(() => Book, (book) => book.copies)
  @JoinColumn()
  book: Book;

  @ManyToOne(() => Library, (library) => library.copies)
  @JoinColumn()
  library: Library;

  @Column()
  status: copyStatus;
}
