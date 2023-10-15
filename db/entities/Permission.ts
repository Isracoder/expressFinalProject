import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Role } from "./Role.js";
// import { User } from "../../types/users.js";
//   import bcrypt from "bcrypt";

export enum PermissionName {
  addBook = "addBook",
  deleteBook = "deleteBook",
  // changeStatus = "changeStatus",
  librarianAccess = "librarianAccess",
  adminAccess = "adminAccess",
}

@Entity()
export class Permission extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({
    unique: true,
    type: "enum",
    enum: PermissionName,
  })
  name: PermissionName;

  @ManyToMany(() => Role, { cascade: true })
  roles: Role[];
}
// check rels
