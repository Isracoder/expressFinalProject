import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { Book } from "../db/entities/Book.js";
import { allowedNodeEnvironmentFlags } from "process";
dotenv.config();

const createBook = async (
  title: string,
  author: string,
  language: string,
  pubYear: string | number
) => {
  try {
    const book = new Book();
    book.title = title;
    book.language = language;
    book.author = author;
    book.year = typeof pubYear == "string" ? parseInt(pubYear) : pubYear;
    // add more stuff for book
    await book.save();
    return book;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getBooksByAttributes = async (
  title?: string,
  author?: string,
  ISBN?: string,
  id?: number,
  language?: string,
  pages?: number,
  pubYear?: number
) => {
  try {
    console.log("in find book");
    let arr = await Book.find({
      where: [
        { title: title },
        { author: author },
        { ISBN: ISBN },
        { id: id },
        { language: language },
        { pages: pages },
        { year: pubYear },
      ],
    });
    return arr;
  } catch (err) {
    throw err;
  }
};

const getBooksWith = async (
  title?: string,
  author?: string,
  year?: string,
  language?: string
) => {
  try {
    let pubYear = parseInt(year as string);
    let books: Book[] = [];

    let all = await Book.find();
    all.forEach((book) => {
      let addbook = true;
      if (
        author &&
        book.author.toLowerCase() != author.toLowerCase() &&
        !book.author
          .toLowerCase()
          .split(" ")
          .includes((author as string).toLowerCase())
      )
        addbook = false;
      if (
        title &&
        book.title.toLowerCase() != title.toLowerCase() &&
        !book.title
          .toLowerCase()
          .split(" ")
          .includes((title as string).toLowerCase())
      )
        addbook = false;
      if (language && book.language.toLowerCase() != language.toLowerCase())
        addbook = false;
      if (pubYear && book.year != pubYear) addbook = false;
      if (addbook) books.push(book);
    });
    return books;
  } catch (err) {
    throw err;
  }
};

const getIdOfBooksWith = async (
  title?: string,
  author?: string,
  year?: string,
  language?: string
) => {
  try {
    let pubYear = parseInt(year as string);
    let ids: number[] = [];

    let all = await Book.find();
    all.forEach((book) => {
      let addbook = true;
      if (
        author &&
        book.author.toLowerCase() != author.toLowerCase() &&
        !book.author
          .toLowerCase()
          .split(" ")
          .includes((author as string).toLowerCase())
      )
        addbook = false;
      if (
        title &&
        book.title.toLowerCase() != title.toLowerCase() &&
        !book.title
          .toLowerCase()
          .split(" ")
          .includes((title as string).toLowerCase())
      )
        addbook = false;
      if (language && book.language.toLowerCase() != language.toLowerCase())
        addbook = false;
      if (pubYear && book.year != pubYear) addbook = false;
      if (addbook) ids.push(book.id);
    });
    return ids;
  } catch (err) {
    throw err;
  }
};

const getBookbyId = async (bookId: number | string) => {
  try {
    if (typeof bookId === "string") bookId = parseInt(bookId);
    let book = await Book.findOneBy({ id: bookId });
    if (!book) throw { code: 404, reason: "no book was found by that id" };
    return book;
  } catch (err) {
    throw err;
  }
};

const getBooksbyTitle = async (title: string) => {
  // if ()
  // think of implementing fuzzy searching
  try {
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
    if (!books.length)
      throw { code: 404, reason: "no book was found by that title" };
    return books;
  } catch (err) {
    throw err;
  }
};

const getBooksbyAuthor = async (author: string) => {
  // if ()
  // think of implementing fuzzy searching
  try {
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
    if (!books.length)
      throw { code: 404, reason: "no book was found by that author" };
    return books;
  } catch (err) {
    throw err;
  }
};

const getBookbyISBN = async (ISBN: string) => {
  // if ()
  // think of implementing fuzzy searching
  try {
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
  } catch (err) {
    throw err;
  }
};

export {
  getBooksByAttributes as getBookIdsByAttributes,
  getBookbyId,
  getBooksbyAuthor,
  getBookbyISBN,
  getBooksbyTitle,
  getBooksWith,
  getIdOfBooksWith,
  createBook,
};
