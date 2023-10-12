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

export enum PermissionType {
  addBook = "addBook",
  deleteBook = "deleteBook",
  changeStatus = "changeStatus",
}

@Entity()
export class Permission extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({
    unique: true,
    type: "enum",
    enum: PermissionType,
  })
  name: PermissionType;

  @ManyToMany(() => Role, { cascade: true })
  roles: Role[];
}
// check rels
