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
} from "typeorm";
import { User } from "./User.js";
import { Book } from "./Book.js";

@Entity()
export class Review extends BaseEntity {
  @PrimaryGeneratedColumn({})
  id: number;

  @Column({})
  text: string;

  @ManyToOne(() => Book, (Book) => Book.reviews, { cascade: true })
  @JoinColumn()
  book: Book;
  @ManyToOne(() => User, (user) => user.reviews, { cascade: true })
  @JoinColumn()
  user: User;
  @Column({})
  createdAt: Date;

  @Column()
  stars: number;

  @Column({})
  imageUrl: string; // change it later to store the aws s3 link

  // try this later in testing to make sure it works
  // constructor(stars: number) {
  //   super();
  //   if (stars < 1 || stars > 5) {
  //     throw new Error("Stars must be between 1 and 5.");
  //   }
  //   this.stars = stars;
  // }
}
