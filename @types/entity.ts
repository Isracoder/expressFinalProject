import { Book } from "../db/entities/Book.js";
import { Genre } from "../db/entities/Genre.js";
import { Library } from "../db/entities/Library.js";
import { Permission } from "../db/entities/Permission.js";
import { Review } from "../db/entities/Review.js";
import { Role } from "../db/entities/Role.js";
import { User } from "../db/entities/User.js";

// namespace NSEntity {
//   export interface PermissionInt {
//     permission: Permission;
//   }
//   export interface UserInt {
//     user: User;
//   }
//   export interface GenreInt {
//     genre: Genre;
//   }
//   export interface BookInt {
//     Book: Book;
//   }
//   export interface LibraryInt {
//     Library: Library;
//   }
//   export interface RoleInt {
//     Role: Role;
//   }
// }
interface EntityTypes {
  User: typeof User;
  Library: typeof Library;
  Book: typeof Book;
  Genre: typeof Genre;
  Role: typeof Role;
  Permission: typeof Permission;
  Review: typeof Review;
}

const entities: EntityTypes = {
  User,
  Library,
  Book,
  Genre,
  Role,
  Permission,
  Review,
  // ... add other entities here
};

export { entities, EntityTypes };
