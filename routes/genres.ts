import express from "express";
import { authorize } from "../middlewares/auth/authorize.js";
import { paginate } from "../controllers/paginate.js";
import { Genre } from "../db/entities/Genre.js";
import { EntityTypes } from "../@types/entity.js";
import { getBookbyId } from "../controllers/book.js";
import { getGenreByName } from "../controllers/genre.js";
import { PermissionName } from "../db/entities/Permission.js";
import { authenticate } from "../middlewares/auth/authenticate.js";
const router = express.Router();
const routeName = "Genre";

router.post(
  "/",
  authenticate,
  authorize(PermissionName.adminAccess),
  async (req, res, next) => {
    try {
      if (!req.body.name)
        throw {
          code: 400,
          reason: "Invalid Genre , send all necessary fields",
        };
      const genre = new Genre();
      genre.name = req.body.name;
      await genre.save();
      res.status(201).send(genre);
    } catch (err) {
      console.log(err);
      next(err);
      // res.status(400).send("Unable to create Genre");
    }
  }
);

router.get("/", (req, res, next) => {
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
      next(error);
      // res.status(500).send("Unable to retrieve Genres");
    });
});

router.put(
  "/book",
  authenticate,
  authorize(PermissionName.adminAccess),
  async (req, res, next) => {
    try {
      if (!req.body.id || !req.body.genre)
        throw {
          code: 400,
          reason: "Please send book id and the name of a genre",
        };
      const book = await getBookbyId(req.body.id);
      const genre = await getGenreByName(req.body.genre);
      book.genres.push(genre);
      await book.save();
      res.status(200).send(book);
    } catch (error) {
      console.log(error);
      next(error);
      // res.send("Error while adding genre to book");
    }
  }
);

router.get("/name", async (req, res, next) => {
  try {
    const genre = await getGenreByName(req.body.name);
    res.send(genre);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

export default router;
