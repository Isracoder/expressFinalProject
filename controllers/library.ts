import { User } from "../db/entities/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
// import { Profile } from "../db/entities/Profile.js";
import datasource from "../db/index.js";
import dotenv from "dotenv";
import { Role } from "../db/entities/Role.js";
import { Library } from "../db/entities/Library.js";
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

export { createLibrary };
