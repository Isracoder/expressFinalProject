// import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from "typeorm";
import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  Unique,
} from "typeorm";
import { User } from "./User.js";
import { Book } from "./Book.js";
// import Decimal from "decimal.js";
// import { DecimalToString, DecimalTransformer } from './decimal.transformer';
@Entity()
@Unique(["book", "user"])
export class Review extends BaseEntity {
  @PrimaryGeneratedColumn({})
  id: number;

  @Column({})
  text: string;

  @Column({})
  createdAt: Date;

  @Column({
    name: "stars",
    type: "decimal",
    precision: 3,
    scale: 2,
  })
  stars: number;
  @ManyToOne(() => Book, (book) => book.reviews, { eager: true })
  @JoinColumn()
  book: Relation<Book>;

  @ManyToOne(() => User, (user) => user.reviews)
  @JoinColumn()
  user: Relation<User>;
}
