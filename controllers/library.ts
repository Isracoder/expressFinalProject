import { User } from "../db/entities/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
// import { Profile } from "../db/entities/Profile.js";
import datasource from "../db/index.js";
import dotenv from "dotenv";
import { Role, RoleType } from "../db/entities/Role.js";
import { Library } from "../db/entities/Library.js";
import { Book } from "../db/entities/Book.js";
import { Librarian } from "../db/entities/Librarian.js";
dotenv.config();

// maybe add a profile as a separate from the user ?
const createLibrary = async (
  name: string,
  type: Library["type"],
  city: string,
  country: string
) => {
  try {
    const lib = new Library();
    lib.name = name;
    lib.type = type;
    lib.country = country;
    lib.city = city;
    await lib.save();
    // console.log("after transaction manager");
    return lib;
  } catch (error) {
    console.log(error);
    throw "something went wrong";
  }
};

const checkLibrarian = async (lib: Library, user: User) => {
  const librarian = await Librarian.findOneBy({ userId: user.id });
  if (librarian && librarian.library.id === lib.id) return true;
  throw "That librarian isn't valid for this library";
};

const getLibraryById = async (libId: number | string) => {
  if (typeof libId === "string") libId = parseInt(libId);
  if (!libId) throw "Not a valid library id";
  const library = await Library.findOneBy({ id: libId });
  if (!library) {
    throw "No library with that id in our database";
  }
  console.log("library found");
  return library;
};

export { createLibrary, checkLibrarian, getLibraryById };
