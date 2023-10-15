import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { Book } from "../db/entities/Book.js";
import { allowedNodeEnvironmentFlags } from "process";
dotenv.config();

const getBookIdsByAttributes = async (
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

const getBookbyId = async (bookId: number | string) => {
  if (typeof bookId === "string") bookId = parseInt(bookId);
  let book = await Book.findOneBy({ id: bookId });
  if (!book) throw "no book was found by that id";
  return book;
};

const getBooksbyTitle = async (title: string) => {
  // if ()
  // think of implementing fuzzy searching
  let books = await Book.find({
    select: {
      id: true,
    },
    where: [
      { title: title },
      { title: title.toLocaleLowerCase() },
      { title: title.toLocaleUpperCase() },
    ],
  });
  if (!books.length) throw "no book was found by that title";
  return books;
};

const getBooksbyAuthor = async (author: string) => {
  // if ()
  // think of implementing fuzzy searching
  let books = await Book.find({
    select: {
      id: true,
    },
    where: [
      { author: author },
      { author: author.toLocaleLowerCase() },
      { author: author.toLocaleUpperCase() },
    ],
  });
  if (!books.length) throw "no book was found by that author";
  return books;
};

const getBookbyISBN = async (ISBN: string) => {
  // if ()
  // think of implementing fuzzy searching
  let books = await Book.find({
    select: {
      id: true,
    },
    where: [
      { ISBN: ISBN },
      { ISBN: ISBN.toLocaleLowerCase() },
      { ISBN: ISBN.toLocaleUpperCase() },
    ],
  });
  if (!books.length) throw "no book was found by that ISBN";
  return books;
};

export {
  getBookIdsByAttributes,
  getBookbyId,
  getBooksbyAuthor,
  getBooksbyTitle,
};
