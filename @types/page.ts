import { Book } from "../db/entities/Book.js";
import { Genre } from "../db/entities/Genre.js";
import { Library } from "../db/entities/Library.js";
import { Permission } from "../db/entities/Permission.js";
import { Role } from "../db/entities/Role.js";
import { User } from "../db/entities/User.js";
import { EntityTypes } from "./entity.js";

interface GetAll {
  page: string;
  pageSize: string;
  dbName: keyof EntityTypes;
  // dbName: typeof (User | Library | Permission | Role | Genre | Book) ;
}
interface PaginateEntityList<T> {
  page: string;
  pageSize: string;
  list: T[];
}
export { GetAll, PaginateEntityList };
