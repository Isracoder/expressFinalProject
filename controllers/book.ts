import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { Book } from "../db/entities/Book.js";
dotenv.config();

const findBook = async (title: string, author: string) => {
  console.log("in find book");
  try {
    // try to find book
  } catch (error) {
    console.log(error); // change to logger file
    throw "Can't find book";
  }
};

export { findBook };
