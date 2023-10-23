import { Book } from "../db/entities/Book.js";
import { Copy } from "../db/entities/Copy.js";
import { Genre } from "../db/entities/Genre.js";
import { Library } from "../db/entities/Library.js";
import { Permission } from "../db/entities/Permission.js";
import { Review } from "../db/entities/Review.js";
import { Role } from "../db/entities/Role.js";
import { User } from "../db/entities/User.js";

interface EntityTypes {
  User: typeof User;
  Library: typeof Library;
  Book: typeof Book;
  Genre: typeof Genre;
  Role: typeof Role;
  Permission: typeof Permission;
  Review: typeof Review;
  Copy: typeof Copy;
}

const entities: EntityTypes = {
  User,
  Library,
  Book,
  Genre,
  Role,
  Permission,
  Review,
  Copy,
  // ... add other entities here
};

export { entities, EntityTypes };
