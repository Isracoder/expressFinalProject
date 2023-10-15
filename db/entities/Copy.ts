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
  library: Relation<Library>;

  @Column({
    type: "enum",
    enum: copyStatus,
    default: copyStatus.available,
  })
  status: copyStatus;
}
// consider adding a due date column ,
// or a column that is either a due date (for free libraries) or num of copies (for bookstores)
