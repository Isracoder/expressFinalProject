import express from "express";
import { authorize } from "../middlewares/auth/authorize.js";
const router = express.Router();
const routeName = "User";

import { EntityTypes } from "../@types/entity.js";
import { paginate } from "../controllers/paginate.js";
import { createUser, login } from "../controllers/user.js";
import { authenticate } from "../middlewares/auth/authenticate.js";
import { validateUser } from "../middlewares/validation/validUser.js";
import { create } from "domain";

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

router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log("in post methodj");
  login(email, password)
    .then((data) => {
      console.log("hi ho here's the data");
      res.send(data);
    })
    .catch((err) => {
      console.log("error bad request");
      res.status(401).send(err);
    });
});

router.get(
  "/data",
  /* authenticate , */ (req, res) => {
    // Create a chart using a visualization library (e.g., Chart.js)
    // const chartData = {
    //   labels: ["Category A", "Category B", "Category C"],
    //   datasets: [
    //     {
    //       data: [100, 200, 300], // Sample data, replace with actual data
    //       backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
    //     },
    //   ],
    // };
    const chartData = {
      fantasy: 5,
      adventure: 3,
      horror: 2,
    };

    res.json(chartData);
  }
);

router.post(
  "/register",
  /*authorize("POST_users"),*/ validateUser,
  (req, res, next) => {
    createUser(
      req.body.username,
      req.body.password,
      req.body.email,
      req.body.DOB
    )
      .then(() => {
        res.status(201).send("User created successfully");
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send(err);
      });
  }
);

export default router;
