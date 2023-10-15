import express from "express";
import { authorize } from "../middlewares/auth/authorize.js";
const router = express.Router();
const routeName = "Copy";
import { EntityTypes } from "../@types/entity.js";
import { paginate } from "../controllers/paginate.js";
import { authenticate } from "../middlewares/auth/authenticate.js";
import { getBookbyId } from "../controllers/book.js";
import { Copy, copyStatus } from "../db/entities/Copy.js";
import { isDeepStrictEqual } from "util";
import { PermissionName } from "../db/entities/Permission.js";
import { checkLibrarian, getLibraryById } from "../controllers/library.js";
import { Librarian } from "../db/entities/Librarian.js";
import { Library } from "../db/entities/Library.js";
import { Book } from "../db/entities/Book.js";
import { parseConfigFileTextToJson } from "typescript";
import { get } from "http";

// adding a copy of a book for a library , auth + auth
router.post(
  "/",
  authenticate,
  authorize(PermissionName.librarianAccess),
  async (req, res) => {
    // create a copy
    try {
      const library = await getLibraryById(req.body.libId);
      checkLibrarian(library, res.locals.user); // check if this librarian can add to this library
      const bookId = parseInt(req.body.bookId);
      // if (!bookId) res.send("Please enter a valid book id");
      const book = await Book.findOneBy({ id: bookId });
      if (!book) {
        res.send("No book found by that id");
        return;
      }

      const copy = new Copy();
      copy.book = book;
      copy.library = library;

      // copy.status = copyStatus.available; // is the default
      await copy.save();
      res.send(`${routeName} created successfully`);
    } catch (err) {
      console.log(err);
      res.send("Error while adding new copy to library");
    }
  }
);

// maybe get only copies in the same city as me ? default it to my city , or to the city sent
router.get("/book", async (req, res) => {
  try {
    const id = parseInt(req.body.bookId);
    if (!id) res.send("Send a valid bookId number");
    // const book = await getBookbyId(id);
    const copies = await Copy.find({
      where: [
        {
          book: {
            id: id,
          },
        },
      ],
    });
    if (!copies) res.send("No copies were found for that book id");
    res.send(copies);
  } catch (err) {
    console.log(err);
    res.send("Something went wrong trying to find copies of that book");
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

router.put(
  "/status",
  authenticate,
  authorize(PermissionName.librarianAccess),
  async (req, res) => {
    try {
      const status = req.body.status;
      if (!Object.values(copyStatus).includes(status)) {
        throw "Not a valid copy status";
      }
      // const book = await getBookbyId(req.body.bookId);
      const copy = await Copy.findOneBy({ id: parseInt(req.body.copyId) });
      if (!copy) throw "No copy found by that copy id";
      const library = await getLibraryById(req.body.libId);
      checkLibrarian(library, res.locals.user);
      copy.status = status;
      await copy.save();
      res.send(`Copy status changed successfully to ${status}`);
    } catch (error) {
      console.log(error);
      res.send("Error changing copy status");
    }
  }
);
export default router;
