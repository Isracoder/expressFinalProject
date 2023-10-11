import express from "express";
import { authorize } from "../middlewares/auth/authorize.js";
const router = express.Router();
const routeName = "Library";
import { EntityTypes } from "../@types/entity.js";
import { paginate } from "../controllers/paginate.js";
import { createLibrary } from "../controllers/library.js";
import { validateLibrary } from "../middlewares/validation/validLibrary.js";
import { Library } from "../db/entities/Library.js";

router.post("/register", validateLibrary, async (req, res) => {
  createLibrary(req.body.name, req.body.type, req.body.country, req.body.city)
    .then(() => {
      res.status(201).send("User created successfully");
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(err);
    });
  // res.send(`${routeName} created successfully`);
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

router.get("/in", async (req, res) => {
  const country = String(req.query.country);
  const city = String(req.query.city);
  let arr: Library[] = [];
  if (country && city) {
    arr = await Library.find({
      where: [{ country: country, city: city }],
    });
  } else if (country) {
    arr = await Library.find({
      where: [{ country: country }],
    });
  } else if (city) {
    arr = await Library.find({
      where: [{ city: city }],
    });
  } else res.send("Please enter the name of a city , country , or both");
  if (!arr.length) res.send("No library was found in that area");
  res.send({ arr });
});

router.get("/id", async (req, res) => {
  const id = Number(req.body.id);
  if (!id || isNaN(id)) res.send("Please send in a valid id");
  const data = await Library.findOne({ where: { id: id } });
  if (!data) res.send("No library was found by that id");
  res.send(data);
});

export default router;
