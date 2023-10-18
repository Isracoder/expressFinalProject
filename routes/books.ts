import express from "express";
import { authorize } from "../middlewares/auth/authorize.js";
const router = express.Router();
const routeName = "Book";
import { EntityTypes } from "../@types/entity.js";
import { paginate, paginateList } from "../controllers/paginate.js";
import {
  getBookIdsByAttributes,
  getBookbyId,
  getBooksWith,
} from "../controllers/book.js";
import { Book } from "../db/entities/Book.js";
import dataSource from "../db/index.js";
import { authenticate } from "../middlewares/auth/authenticate.js";
import { User } from "../db/entities/User.js";
import { RoleType } from "../db/entities/Role.js";
import { PermissionName } from "../db/entities/Permission.js";
import { timeLog } from "console";
import fs from "fs";
import { getTitle, putImage, sendEmail } from "../controllers/aws.js";
import { PaginateEntityList } from "../@types/page.js";

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
router.get("/", async (req, res) => {
  // res.send(`In ${routeName} router`);
  console.log("In books");
  const entityName: keyof EntityTypes = routeName;
  const books = await Book.find();
  const payload: PaginateEntityList<Book> = {
    page: req.query.page?.toString() || "1",
    pageSize: req.query.pageSize?.toString() || "10",
    list: books,
  };

  paginateList(payload)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
      res.send("Error  getting all user data");
    });
});

// getting books with specific properties
router.get("/with", async (req, res) => {
  try {
    const language = req.query.language as string;
    const title = req.query.title as string;
    const author = req.query.author as string;
    let pubYear = req.query.year as string;
    let books = await getBooksWith(title, author, pubYear, language);

    if (!books.length) res.send("No books matched your querys");
    else res.send(books);
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

// Should I add user permissions so only this user can edit his lists ? maybe the authenticate function is enough

//  adding a book to the want list
router.put("/want", authenticate, async (req, res) => {
  try {
    const user = res.locals.user; //fix this
    // const user = await User.findOneBy({ id: 1 }); // temporary !!
    if (!(user instanceof User)) throw "User must be valid and logged in";
    const book = await getBookbyId(req.body.id);
    const userWithRelation = await User.findOne({
      where: { id: user.id },
      relations: ["wantedBooks"],
    });
    if (!userWithRelation) {
      res.send("Are You sure that is a valid user?");
      return;
    }
    userWithRelation.wantedBooks.push(book);
    await userWithRelation.save();
    res.send("Book added to want list successfully");
  } catch (err) {
    console.log(err);
    res.send("Error while adding a book to your want-list");
  }
});
router.get("/want", authenticate, async (req, res) => {
  try {
    const user = res.locals.user; //fix this
    // const user = await User.findOneBy({ id: 1 }); // temporary !!
    if (!(user instanceof User)) throw "User must be valid and logged in";
    const userWithRelation = await User.findOne({
      where: { id: user.id },
      relations: ["wantedBooks"],
    });
    if (!userWithRelation) {
      res.send("Are You sure that is a valid user?");
      return;
    }
    if (!userWithRelation.wantedBooks) {
      console.log(userWithRelation.wantedBooks);
      res.send("There are no books currently in your want-list");
    } else res.send(userWithRelation.wantedBooks);
  } catch (err) {
    console.log(err);
    res.send("Error while retrieving your want list");
  }
});
// adding a book to the giveaway list
router.put("/giveaway", authenticate, async (req, res) => {
  try {
    const userId = res.locals.user.id || req.body.userId; //fix this
    // if (!(userId instanceof User)) throw "User must be valid and logged in";
    const book = await getBookbyId(req.body.id);
    const userWithRelation = await User.findOne({
      where: { id: userId },
      relations: ["giveawayBooks"],
    });

    if (!userWithRelation) {
      res.send("Are You sure that is a valid user?");
      return;
    }
    userWithRelation.giveawayBooks.push(book);
    await userWithRelation.save();
    res.send("Book added to giveaway list successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error while adding a book to your giveaway list");
  }
});

router.get("/giveaway", authenticate, async (req, res) => {
  try {
    const userId = res.locals.user.id || req.body.userId; //fix this
    // if (!(userId instanceof User)) throw "User must be valid and logged in";
    const userWithRelation = await User.findOne({
      where: { id: userId },
      relations: ["giveawayBooks"],
    });

    if (!userWithRelation) {
      res.send("Are You sure that is a valid user?");
      return;
    }
    if (!userWithRelation.giveawayBooks)
      res.send("There are no books currently in your giveaway-list");
    else res.send(userWithRelation.giveawayBooks);
  } catch (err) {
    console.log(err);
    res.status(400).send("Error while retrieving your giveaway-list");
  }
});

// removing the book from the want list regardless if it was there in the first place or not , maybe change this
router.delete("/want", authenticate, async (req, res) => {
  try {
    const user = res.locals.user;
    if (!(user instanceof User)) throw "User must be valid and logged in";

    const book = await getBookbyId(req.body.id);
    const userWithRelation = await User.findOne({
      where: { id: user.id },
      relations: ["wantedBooks"],
    });
    if (!userWithRelation) {
      res.send("Are You sure that is a valid user?");
      return;
    }
    userWithRelation.wantedBooks = userWithRelation.wantedBooks.filter(
      (wantedBook) => wantedBook.id != book.id
    );
    await userWithRelation.save();
    res.send("Book removed from want list successfully");
  } catch (err) {
    console.log(err);
    res.send("Error while removeing a book from your want-list");
  }
});

// "    "     "   "    the giveaway list     "      "      "       "
router.delete("/giveaway", authenticate, async (req, res) => {
  try {
    const userId = res.locals.user.id || req.body.userId; //fix this
    const book = await getBookbyId(req.body.id);
    const userWithRelation = await User.findOne({
      where: { id: userId },
      relations: ["giveawayBooks"],
    });
    if (!userWithRelation) {
      res.send("Are You sure that is a valid user?");
      return;
    }
    userWithRelation.giveawayBooks = userWithRelation.giveawayBooks.filter(
      (giveBook) => giveBook.id != book.id
    );
    await userWithRelation.save();
    res.send("Book removed from giveaway list successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error while removing a book from your giveaway list");
  }
});

router.get("/find/title", async (req, res) => {
  try {
    if (!req.body.img) {
      return res.status(400).json({ message: "No image uploaded" });
    }
    const result = await getTitle(req.body.img);
    res.send(result);
  } catch (err) {
    console.log(err);
    res.send("Error while getting title text from image");
  }
});

router.put(
  "/image",
  // authenticate,
  // authorize(PermissionName.adminAccess),
  async (req, res) => {
    try {
      if (!req.body.img || !req.body.id) {
        return res.status(400).send("Send an image and the id of a valid book");
      }
      const book = await getBookbyId(req.body.id);
      const data = await putImage(req.body.img, book.id);
      console.log(data);
      console.log("Successfull");
      res.send(data);
    } catch (error) {
      console.log(error);
      res.send("Error while trying to add book image to s3 bucket");
    }
  }
);

// maybe should be in users ?
router.post(
  "/send-email",
  // authenticate,
  // authorize(PermissionName.adminAccess),
  async (req, res) => {
    try {
      const { recipient, subject, message } = req.body;
      if (!recipient || !subject || !message)
        return res.status(400).send("Please send requirements");
      await sendEmail(recipient, subject, message);

      res.status(200).send("Email sent successfully.");
    } catch (error) {
      console.log(error);
      res.send("Error while sending email");
    }
  }
);

export default router;
