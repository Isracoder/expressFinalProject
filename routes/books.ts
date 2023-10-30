import express from "express";
import { authorize } from "../middlewares/auth/authorize.js";
const router = express.Router();
const routeName = "Book";
import { EntityTypes } from "../@types/entity.js";
import { paginate, paginateList } from "../controllers/paginate.js";
import {
  createBook,
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
import { error, timeLog } from "console";
import fs from "fs";
import {
  getTitleFromPublicUrl,
  getUrlParams,
  putImage,
  recognition,
  sendEmail,
} from "../controllers/aws.js";
import { PaginateEntityList } from "../@types/page.js";
import { validateBook } from "../middlewares/validation/validBook.js";

// adding a new book to the overall website , not for any specific library
router.post(
  "/",
  authenticate,
  authorize(PermissionName.adminAccess),
  validateBook,
  async (req, res, next) => {
    try {
      const book = await createBook(
        req.body.title,
        req.body.author,
        req.body.language,
        req.body.pubYear
      );
      res.status(201).send(book);
    } catch (err) {
      console.log(err);
      next(err);
      // res.send(`Error creating ${routeName}`);
    }
  }
);

// getting all books
router.get("/", async (req, res, next) => {
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
      next(err);
      // res.send("Error  getting all user data");
    });
});

// getting books with specific properties
router.get("/with", async (req, res, next) => {
  try {
    const language = req.query.language as string;
    const title = req.query.title as string;
    const author = req.query.author as string;
    let pubYear = req.query.year as string;
    let books = await getBooksWith(title, author, pubYear, language);

    if (!books.length) {
      console.log("No books matched the query");
    }
    res.send(books);
  } catch (err) {
    console.log(err);
    next(error);
    // res.status(500).send("Error while searching for books");
  }
});

// getting a book by id
router.get("/id", (req, res, next) => {
  const bookid = parseInt(req.body.id);
  getBookbyId(bookid)
    .then((data) => {
      console.log("book found");
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
      next(err);
      // res.send("Error while retrieving book by id");
    });
});

// Should I add user permissions so only this user can edit his lists ? maybe the authenticate function is enough

//  adding a book to the want list
router.put("/want", authenticate, async (req, res, next) => {
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
    next(err);
    // res.send("Error while adding a book to your want-list");
  }
});
router.get("/want", authenticate, async (req, res, next) => {
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
      console.log("There are no books currently in your want-list");
    }
    res.send(userWithRelation.wantedBooks);
  } catch (err) {
    console.log(err);
    next(err);
    // res.send("Error while retrieving your want list");
  }
});
// removing the book from the want list regardless if it was there in the first place or not , maybe change this
router.delete("/want", authenticate, async (req, res, next) => {
  try {
    const user = res.locals.user;
    if (!(user instanceof User)) throw "User must be valid and logged in";

    const book = await getBookbyId(req.body.id);
    const userWithRelation = await User.findOne({
      where: { id: user.id },
      relations: ["wantedBooks"],
    });
    if (!userWithRelation) {
      console.log("Are You sure that is a valid user?");
      res.send("User must be valid and logged in");
      return;
    }
    userWithRelation.wantedBooks = userWithRelation.wantedBooks.filter(
      (wantedBook) => wantedBook.id != book.id
    );
    await userWithRelation.save();
    res.send("Book removed from want list successfully");
  } catch (err) {
    console.log(err);
    next(err);
    // res.send("Error while removing a book from your want-list");
  }
});
// adding a book to the giveaway list
router.put("/giveaway", authenticate, async (req, res, next) => {
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
    next(err);
    // res.status(500).send("Error while adding a book to your giveaway list");
  }
});

router.get("/giveaway", authenticate, async (req, res, next) => {
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
    next(err);
    // res.status(400).send("Error while retrieving your giveaway-list");
  }
});

// "    "     "   "    the giveaway list     "      "      "       "
router.delete("/giveaway", authenticate, async (req, res, next) => {
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
    next(err);
    // res.status(500).send("Error while removing a book from your giveaway list");
  }
});

router.get("/find/title", async (req, res, next) => {
  try {
    if (!req.body.img) {
      return res.status(400).json({ message: "No image uploaded" });
    }
    const params = await getUrlParams(req.body.img);
    let response: string[] = [];
    recognition.detectText(params, async (err, data) => {
      if (err) {
        console.error("Error analyzing image:", err);
        throw "error analyzing image";
      }
      data.TextDetections?.forEach((result) => {
        if (
          result.Type == "LINE" &&
          result.Confidence &&
          result.Confidence >= 70 &&
          result.DetectedText
        )
          response.push(result.DetectedText);
      });
      res.send(response);
    });
  } catch (err) {
    console.log(err);
    next(err);
    // res.send("Error while getting title text from image");
  }
});

router.put(
  "/image",
  authenticate,
  authorize(PermissionName.adminAccess),
  async (req, res, next) => {
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
      next(error);
      // res.send("Error while trying to add book image to s3 bucket");
    }
  }
);

export default router;
