import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
// import { User } from "../../types/users.js";
import bcrypt from "bcrypt";
import { Role } from "./Role.js";
import { Library } from "./Library.js";
import { Book } from "./Book.js";
import { Review } from "./Review.js";

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

  @ManyToMany(() => Book)
  @JoinTable({
    name: "user-want-list",
    joinColumn: {
      name: "userId",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "bookid",
      referencedColumnName: "id",
    },
  })
  want: Book[];

  @ManyToMany(() => Role, { cascade: true })
  @JoinTable()
  roles: Role[];

  @ManyToMany(() => Library, { cascade: true })
  @JoinTable()
  libraries: Library[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];
}
// check rels
