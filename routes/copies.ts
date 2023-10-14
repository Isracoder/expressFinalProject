import express from "express";
import { authorize } from "../middlewares/auth/authorize.js";
const router = express.Router();
const routeName = "Copy";
import { EntityTypes } from "../@types/entity.js";
import { paginate } from "../controllers/paginate.js";
import { authenticate } from "../middlewares/auth/authenticate.js";
import { getBookbyId } from "../controllers/book.js";
import { Copy } from "../db/entities/Copy.js";
import { isDeepStrictEqual } from "util";

// adding a copy of a book for a library , auth + auth
router.post("/", authenticate, async (req, res) => {
  // create a copy
  res.send(`${routeName} created successfully`);
});

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
export default router;
