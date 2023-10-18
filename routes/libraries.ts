import express from "express";
import { authorize } from "../middlewares/auth/authorize.js";
const router = express.Router();
const routeName = "Library";
import { EntityTypes } from "../@types/entity.js";
import { paginate } from "../controllers/paginate.js";
import { createLibrary, getLibraryById } from "../controllers/library.js";
import { validateLibrary } from "../middlewares/validation/validLibrary.js";
import { Library } from "../db/entities/Library.js";
import { PermissionName } from "../db/entities/Permission.js";
import { authenticate } from "../middlewares/auth/authenticate.js";
import { count } from "console";
import { getBooksWith, getIdOfBooksWith } from "../controllers/book.js";
import { copyFileSync } from "fs";
import { Copy } from "../db/entities/Copy.js";

router.post(
  "/",
  authenticate,
  authorize(PermissionName.adminAccess),
  validateLibrary,
  async (req, res) => {
    createLibrary(req.body.name, req.body.type, req.body.city, req.body.country)
      .then(() => {
        res.status(201).send("Library created successfully");
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send(err);
      });
    // res.send(`${routeName} created successfully`);
  }
);

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

router.get("/in", async (req, res) => {
  const country = req.query.country as string | undefined;
  const city = req.query.city as string | undefined;

  let arr: Library[] = [];
  if (country && city) {
    console.log(`In search library ${city} , ${country}`);
    arr = await Library.find({
      where: [{ country: country, city: city }],
    });
  } else if (country) {
    console.log(`In country ${country}`);
    arr = await Library.find({
      where: [{ country: country }],
    });
  } else if (city) {
    console.log(`In city ${city}`);
    arr = await Library.find({
      where: [{ city: city }],
    });
  } else res.send("Please enter the name of a city , country , or both");
  if (!arr.length) {
    res.send("No library was found in that area");
    return;
  }
  res.send(arr);
});

router.get("/id", async (req, res) => {
  try {
    const lib = await getLibraryById(req.body.id);
    res.send(lib);
  } catch (error) {
    console.log(error);
    res.send("Erorr while searching for library by id");
  }
});

router.get("/id/books", async (req, res) => {
  try {
    const lib = await getLibraryById(req.body.id);
    const ids = await getIdOfBooksWith(
      req.query.title as string,
      req.query.author as string,
      req.query.year as string,
      req.query.language as string
    );
    if (!ids.length) {
      res.send("No books with those attributes");
      return;
    }
    const allCopies = await Copy.find({ relations: ["book", "library"] });
    const copies: Copy[] = [];
    allCopies.forEach((copy) => {
      if (ids.includes(copy.book.id) && copy.library.id == lib.id)
        copies.push(copy);
    });

    if (!copies.length)
      res.send("No books in that library with those attributes");
    else res.send(copies);
  } catch (error) {
    console.log(error);
    res.send("Erorr while searching for library by id");
  }
});

export default router;
