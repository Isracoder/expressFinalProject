import express from "express";
import { authorize } from "../middlewares/auth/authorize.js";
import { paginate } from "../controllers/paginate.js";
import { Genre } from "../db/entities/Genre.js";
import { EntityTypes } from "../@types/entity.js";
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

export default router;
