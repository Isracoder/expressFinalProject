import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { Book } from "../db/entities/Book.js";
import { allowedNodeEnvironmentFlags } from "process";
dotenv.config();

const findBookIdByAttribute = async (
  title?: string,
  author?: string,
  ISBN?: string,
  id?: number,
  language?: string,
  pages?: number,
  pubYear?: number
) => {
  console.log("in find book");
  let arr = await Book.find({
    select: {
      id: true,
    },
    where: [
      { title: title },
      { author: author },
      { ISBN: ISBN },
      { id: id },
      { language: language },
      { pages: pages },
      { pubYear: pubYear },
    ],
  });
  return arr;
};

export { findBookIdByAttribute };
