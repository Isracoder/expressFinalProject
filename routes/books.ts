import express from "express";
import { authorize } from "../middlewares/auth/authorize.js";
const router = express.Router();
const routeName = "Book";
import { EntityTypes } from "../@types/entity.js";
import { paginate } from "../controllers/paginate.js";
import { getBookbyId } from "../controllers/book.js";

router.post("/", async (req, res) => {
  // // const genre = new Genre();
  // genre.name = req.body.name;
  // await genre.save();
  res.send(`${routeName} created successfully`);
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

router.get("/with", (req, res) => {
  const { author, title, ISBN } = req.query;
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

export default router;
