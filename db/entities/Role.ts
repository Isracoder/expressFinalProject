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
//   import bcrypt from "bcrypt";

@Entity()
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({
    type: "enum",
    enum: ["admin", "user", "editor"],
    default: "user",
    unique: true,
  })
  name: "user" | "admin" | "editor";

  @ManyToMany(() => User, { cascade: true })
  users: User[];

  @ManyToMany(() => Permission, { cascade: true, eager: true })
  @JoinTable()
  permisssions: Permission[];
}
// add many to many  with user      --complete
// , many to many with permission   -- complete
