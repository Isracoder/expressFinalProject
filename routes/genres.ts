import express from "express";
import { authorize } from "../middlewares/auth/authorize.js";
import { paginate } from "../controllers/paginate.js";
import { Genre } from "../db/entities/Genre.js";
import { EntityTypes } from "../@types/entity.js";
import { getBookbyId } from "../controllers/book.js";
import { getGenreByName } from "../controllers/genre.js";
const router = express.Router();
const routeName = "Genre";

router.post("/", async (req, res) => {
  const genre = new Genre();
  genre.name = req.body.name;
  await genre.save();
  res.send("Genre added successfully");
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

router.put("/book", async (req, res) => {
  try {
    if (!req.body.id || !req.body.genre)
      return res.send("Please send book id and the name of a genre");
    const book = await getBookbyId(req.body.id);
    const genre = await getGenreByName(req.body.genre);
    book.genres.push(genre);
    await book.save();
    res.send("Genre added to book successfully");
  } catch (error) {
    console.log(error);
    res.send("Error while adding genre to book");
  }
});

export default router;
