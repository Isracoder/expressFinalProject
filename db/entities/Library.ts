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
export class Library extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({
    unique: true,
  })
  name: string;

  @Column({
    type: "enum",
    enum: ["Bookstore", "Public", "Private", "School", "University"],
  })
  type: "Bookstore" | "Public" | "Private" | "School" | "University";

  @Column({
    // look into setting it as a valid country code , maybe with a constructor
    // or with a built in function from some library
    nullable: false,
  })
  country: string;

  @Column({ nullable: false })
  city: string;

  @ManyToMany(() => User, { cascade: true })
  users: User[];

  // @ManyToMany(() => Book, { cascade: true, eager: true })
  // @JoinTable()
  // Book: Book[];
}
// check rels
