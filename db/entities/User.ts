import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
// import { User } from "../../types/users.js";
import bcrypt from "bcrypt";
import { Role } from "./Role.js";
import { Library } from "./Library.js";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ length: 100, nullable: false })
  username: string;

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  DOB: Date;

  @Column({})
  country: string;

  @Column({})
  city: string;

  @ManyToMany(() => Role, { cascade: true, eager: true })
  @JoinTable()
  roles: Role[];

  @ManyToMany(() => Library, { cascade: true, eager: true })
  @JoinTable()
  libraries: Library[];
}
// check rels
