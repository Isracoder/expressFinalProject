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
import { allowedNodeEnvironmentFlags } from "process";

const validYear = (year: number) => {
  const date = new Date();

  if (isNaN(year) || year > date.getFullYear() || year < 1700) {
    return false;
  }
  return true;
};

router.post("/", async (req, res) => {
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
    await book.save();
    // book = {...book}

    res.send(`${routeName} created successfully`);
  } catch (err) {
    console.log(err);
    res.send(`Error creating ${routeName}`);
  }
});

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

router.post("/want", authenticate, async (req, res) => {
  try {
    const user = res.locals.user; //fix this
    // const user = await User.findOneBy({ id: 1 }); // temporary !!
    if (!(user instanceof User)) {
      res.send("Please send a valid user , you must be logged in");
      return;
    }
    const id = parseInt(req.body.id);
    if (isNaN(id)) res.send("Please enter book id");
    const book = await Book.findOneBy({ id });
    if (!book) {
      res.send("No book was found with that id");
      return;
    }
    user.wantedBooks = [...user.wantedBooks, book];
    await user.save();
    res.send("Book added to want list successfully");
  } catch (err) {
    console.log(err);
    res.send("Error while adding a book to your want-list");
  }
});

router.post("/giveaway", authenticate, async (req, res) => {
  try {
    const user = res.locals.user; //fix this
    // const user = await User.findOneBy({ id: 1 }); // temporary !!
    if (!(user instanceof User)) {
      res.send("Please send a valid user , you must be logged in");
      return;
    }
    const id = parseInt(req.body.id);
    if (isNaN(id)) res.send("Please enter book id");
    const book = await Book.findOneBy({ id });
    if (!book) {
      res.send("No book was found with that id");
      return;
    }
    // add book to giveaway list
    user.giveawayBooks = [...user.giveawayBooks, book];
    await user.save();
    res.send("Book added to giveaway list successfully");
  } catch (err) {
    console.log(err);
    res.send("Error while adding a book to your giveaway list");
  }
});

router.delete("/want", authenticate, async (req, res) => {
  try {
    const user = res.locals.user; //fix this
    // const user = await User.findOneBy({ id: 1 }); // temporary !!
    if (!(user instanceof User)) {
      res.send("Please send a valid user , you must be logged in");
      return;
    }
    const id = parseInt(req.body.id);
    if (isNaN(id)) res.send("Please enter book id");
    const book = await Book.findOneBy({ id });
    if (!book) {
      res.send("No book was found with that id");
      return;
    }
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

router.delete("/giveaway", async (req, res) => {
  try {
    const user = res.locals.user; //fix this
    // const user = await User.findOneBy({ id: 1 }); // temporary !!
    if (!(user instanceof User)) {
      res.send("Please send a valid user , you must be logged in");
      return;
    }
    const id = parseInt(req.body.id);
    if (isNaN(id)) res.send("Please enter book id");
    const book = await Book.findOneBy({ id });
    if (!book) {
      res.send("No book was found with that id");
      return;
    }
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
