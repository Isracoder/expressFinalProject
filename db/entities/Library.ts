import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Book } from "./Book.js";
import { User } from "./User.js";
import { Copy } from "./Copy.js";
import { Librarian } from "./Librarian.js";
//   import { Permission } from "./Permission.js";
// import { User } from "../../types/users.js";
//   import bcrypt from "bcrypt";
export enum LibraryType {
  bookstore = "bookstore",
  public = "public",
  private = "private",
  school = "school",
  university = "university",
}

@Entity()
export class Library extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    type: "enum",
    enum: LibraryType,
  })
  type: LibraryType;

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

  @OneToMany(() => Copy, (copy) => copy.book)
  copies: Copy[];

  @OneToMany(() => Librarian, (librarian) => librarian.library)
  librarians: Librarian[];
}
// check rels
