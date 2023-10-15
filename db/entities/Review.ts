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
} from "typeorm";
import { User } from "./User.js";
import { Book } from "./Book.js";

@Entity()
export class Review extends BaseEntity {
  @PrimaryGeneratedColumn({})
  id: number;

  @Column({})
  text: string;

  @ManyToOne(() => Book, (book) => book.reviews)
  @JoinColumn()
  book: Relation<Book>;

  @ManyToOne(() => User, (user) => user.reviews, { cascade: true })
  @JoinColumn()
  user: Relation<User>;

  @Column({})
  createdAt: Date;

  @Column()
  stars: number;

  @Column({})
  imageUrl: string; // change it later to store the aws s3 link
}
