import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import { Book } from "./Book.js";
import { User } from "./User.js";
import { Copy } from "./Copy.js";
import { Library } from "./Library.js";
//   import { Permission } from "./Permission.js";
// import { User } from "../../types/users.js";
//   import bcrypt from "bcrypt";

@Entity()
export class Librarian extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @ManyToOne(() => Library, (library) => library.librarians)
  @JoinColumn()
  library: Relation<Library>;

  @Column({ nullable: false, unique: true })
  userId: number;
}
// check rels
