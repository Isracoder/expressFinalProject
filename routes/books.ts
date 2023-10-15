import express from "express";
import { authorize } from "../middlewares/auth/authorize.js";
const router = express.Router();
const routeName = "Book";
import { EntityTypes } from "../@types/entity.js";
import { paginate } from "../controllers/paginate.js";
import { getBookIdsByAttributes, getBookbyId } from "../controllers/book.js";
import { Book } from "../db/entities/Book.js";
import dataSource from "../db/index.js";
import { authenticate } from "../middlewares/auth/authenticate.js";
import { User } from "../db/entities/User.js";
import { RoleType } from "../db/entities/Role.js";
import { PermissionName } from "../db/entities/Permission.js";

const validYear = (year: number) => {
  const date = new Date();

  if (isNaN(year) || year > date.getFullYear() || year < 1700) {
    return false;
  }
  return true;
};

// adding a new book to the overall website , not for any specific library
router.post(
  "/",
  authenticate,
  authorize(PermissionName.adminAccess),
  async (req, res) => {
    try {
      const { title, author, language } = req.body;
      const pubYear = parseInt(req.body.pubYear);
      if (!validYear(pubYear) || !title || !author || !language) {
        res.send(
          "Please enter required book info correctly (pubYear , title , author , language) "
        );
      }
      const book = new Book();
      book.title = title;
      book.language = language;
      book.author = author;
      book.pubYear = pubYear;
      // add more stuff for book
      await book.save();
      // book = {...book}

      res.send(`${routeName} created successfully`);
    } catch (err) {
      console.log(err);
      res.send(`Error creating ${routeName}`);
    }
  }
);

// getting all books
router.get("/", (req, res) => {
  // res.send(`In ${routeName} router`);

  const entityName: keyof EntityTypes = routeName;
  const payload = {
    page: req.query.page?.toString() || "1",
    pageSize: req.query.pageSize?.toString() || "10",
    dbName: entityName,
  };

  paginate(payload)
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Something went wrong");
    });
});

// getting books with specific properties
router.get("/with", async (req, res) => {
  try {
    const { author, title, language } = req.query;
    const pubYear = parseInt(req.query.pubYear as string);
    let books: Book[] = [];

    let all = await Book.find();
    all.forEach((book) => {
      let addbook = true;
      if (author && book.author != author) addbook = false;
      if (title && book.title != title) addbook = false;
      if (language && book.language != language) addbook = false;
      if (pubYear && (isNaN(pubYear) || book.pubYear != pubYear))
        addbook = false;
      if (addbook) books.push(book);
    });
    if (!books.length) res.send("No books matched your querys");
    res.send(books);
  } catch (err) {
    console.log(err);
    res.send("Error while querying for books");
  }
});

// getting a book by id
router.get("/id", (req, res) => {
  const bookid = parseInt(req.body.id);
  getBookbyId(bookid)
    .then((data) => {
      console.log("book found");
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
      res.send("Error while retrieving book by id");
    });
});

//  adding a book to the want list
router.put("/want", authenticate, async (req, res) => {
  try {
    const user = res.locals.user; //fix this
    // const user = await User.findOneBy({ id: 1 }); // temporary !!
    if (!(user instanceof User)) throw "User must be valid and logged in";
    const book = await getBookbyId(req.body.id);
    user.wantedBooks.push(book);
    await user.save();
    res.send("Book added to want list successfully");
  } catch (err) {
    console.log(err);
    res.send("Error while adding a book to your want-list");
  }
});

// adding a book to the giveaway list
router.put("/giveaway", authenticate, async (req, res) => {
  try {
    const user = res.locals.user; //fix this
    if (!(user instanceof User)) throw "User must be valid and logged in";
    const book = await getBookbyId(req.body.id);
    // add book to giveaway list
    user.giveawayBooks.push(book);
    await user.save();
    res.send("Book added to giveaway list successfully");
  } catch (err) {
    console.log(err);
    res.send("Error while adding a book to your giveaway list");
  }
});

// removing the book from the want list regardless if it was there in the first place or not , maybe change this
router.delete("/want", authenticate, async (req, res) => {
  try {
    const user = res.locals.user; //fix this
    if (!(user instanceof User)) throw "User must be valid and logged in";
    const book = await getBookbyId(req.body.id);
    user.wantedBooks = user.wantedBooks.filter(
      (wantedBook) => wantedBook != book
    );
    await user.save();
    res.send("Book removed from want list successfully");
  } catch (err) {
    console.log(err);
    res.send("Error while removeing a book from your want-list");
  }
});

// "    "     "   "    the giveaway list     "      "      "       "
router.delete("/giveaway", async (req, res) => {
  try {
    const user = res.locals.user; //fix this
    if (!(user instanceof User)) throw "User must be valid and logged in";
    const book = await getBookbyId(req.body.id);
    // add book to giveaway list
    user.giveawayBooks = user.giveawayBooks.filter(
      (giveBook) => giveBook != book
    );
    await user.save();
    res.send("Book removed from giveaway list successfully");
  } catch (err) {
    console.log(err);
    res.send("Error while removing a book from your giveaway list");
  }
});

export default router;
