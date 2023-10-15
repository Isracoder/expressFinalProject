import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User.js";
import { Permission } from "./Permission.js";
// import { User } from "../../types/users.js";
import { NSUser } from "../../@types/user.js";
//   import bcrypt from "bcrypt";

export enum RoleType {
  user = "user",
  admin = "admin",
  librarian = "librarian",
}

@Entity()
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({
    type: "enum",
    enum: RoleType,
    // default:
    unique: true,
  })
  name: RoleType;

  @ManyToMany(() => User, { cascade: true })
  users: User[];

  @ManyToMany(() => Permission, { cascade: true, eager: true })
  @JoinTable()
  permisssions: Permission[];
}

// maybe add before insert turn every string into lowercase
