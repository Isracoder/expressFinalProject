// import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from "typeorm";
import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Review extends BaseEntity {
  @PrimaryGeneratedColumn({})
  id: number;

  @Column({})
  text: string;

  @Column({})
  bookId: number;
  @Column({})
  userId: number;
  @Column({})
  createdAt: Date;

  @Column()
  stars: number;

  @Column({})
  imageUrl: string; // change it later to store the aws s3 link

  // try this later in testing to make sure it works
  constructor(stars: number) {
    super();
    if (stars < 1 || stars > 5) {
      throw new Error("Stars must be between 1 and 5.");
    }
    this.stars = stars;
  }
}
