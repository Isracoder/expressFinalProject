import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { Role } from "./Role.js";
import { Genre } from "./Genre.js";
import { Library } from "./Library.js";
import { User } from "./User.js";
import { Review } from "./Review.js";
import { Copy } from "./Copy.js";
import { title } from "process";
// import { User } from "../../types/users.js";
//   import bcrypt from "bcrypt";

@Entity()
@Unique(["title", "author"])
export class Book extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ nullable: false, length: 200 })
  title: string;

  @Column({ nullable: false })
  author: string;

  @Column({ nullable: true })
  ISBN: string;

  @Column({ nullable: true })
  ageRange: string;

  @Column({ nullable: true })
  pages: number;

  @Column({ nullable: false })
  year: number;

  @Column({ nullable: false })
  language: string;

  @ManyToMany(() => Genre, (genre) => genre.books, {
    cascade: true,
    eager: true,
  })
  genres: Genre[];

  @ManyToMany(() => Library, {})
  libraries: Library[];

  @ManyToMany(() => User, (user) => user.wantedBooks)
  usersThatWant: User[];

  @ManyToMany(() => User, (user) => user.giveawayBooks)
  usersGiveaway: User[];

  @OneToMany(() => Review, (review) => review.book)
  reviews: Review[];
  @OneToMany(() => Copy, (copy) => copy.book)
  copies: Copy[];
}
// add many to many  with Role ,
