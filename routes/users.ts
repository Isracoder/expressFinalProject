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
import { Library } from "../db/entities/Library.js";
import { User } from "../db/entities/User.js";
import { Book } from "../db/entities/Book.js";
import { Copy, copyStatus } from "../db/entities/Copy.js";
import { FileWatcherEventKind } from "typescript";

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

// maybe not the best place for this route , users/available ? books/available ? copies/available
router.get("/available", authenticate, async (req, res) => {
  try {
    // const libraries = res.locals.libraries ; // one idea for this approach
    const user = res.locals.user;
    if (!(user instanceof User)) {
      res.send("Make sure the user is correctly logged in");
      return;
    }
    const libraries = await Library.find({ where: { city: user.city } });
    const wantedBooks = user.wantedBooks;
    let available: Copy[] = [];
    libraries.forEach((library) => {
      library.copies.forEach((copy) => {
        if (
          wantedBooks.includes(copy.book) &&
          copy.status == copyStatus.available
        )
          available.push(copy);
      });
    });
    if (!available.length)
      res.send("No copies that the user wants are currently available");
    console.log("copies were found");
    res.send(available); // consider paginating the result
  } catch (err) {
    console.log(err);
    res.send("An error occurred while searching for available wanted books");
  }
});

router.post("/friend", authenticate, async (req, res) => {
  try {
    const user = res.locals.user;
    if (!(user instanceof User)) {
      res.send("The user must be signed in");
      return;
    }
    const friendId = parseInt(req.body.id);
    if (isNaN(friendId)) res.send("Make sure the user id is a number");
    const friend = await User.findOneBy({ id: friendId });
    if (!friend) {
      res.send("No friend was found by that id");
      return;
    }
    if (user.friends.includes(friend)) res.send("You are already friends");
    user.friends.push(friend);
    // if this doesn't automatically add the friend from the other side
    // then i need to add friend.friends.push(user)
    await user.save();
    res.send("Friend added successfully");
  } catch (err) {
    console.log(err);
    res.send("Error while adding a friend");
  }
});

router.delete("/friend", authenticate, async (req, res) => {
  try {
    const user = res.locals.user;
    if (!(user instanceof User)) {
      res.send("The user must be signed in");
      return;
    }
    const friendId = parseInt(req.body.id);
    if (isNaN(friendId)) res.send("Make sure the user id is a number");
    const friend = await User.findOneBy({ id: friendId });
    if (!friend) {
      res.send("No friend was found by that id");
      return;
    }
    if (!user.friends.includes(friend)) res.send("You are not friends");
    user.friends = user.friends.filter((person) => person != friend);
    await user.save();
    // if this doesn't remove from other side then filter friends.friends
    res.send("Friend removed successfully");
  } catch (err) {
    console.log(err);
    res.send("Error while deleting a friend");
  }
});

router.get("/giveaway", authenticate, async (req, res) => {
  try {
    const user = res.locals.user;
    if (!(user instanceof User)) {
      throw "Get valid user from login !";
    }
    const wantedList = user.wantedBooks;
    const usersInSameCity = await User.find({ where: { city: user.city } });
    const giveaway: Object[] = [];
    wantedList.forEach((wantedBook) => {
      usersInSameCity.forEach((person) => {
        if (person != user && person.giveawayBooks.includes(wantedBook)) {
          giveaway.push({ user: person, book: wantedBook });
        }
      });
    });
    if (!giveaway.length)
      res.send("No users in your city are giving away books that you want");
    res.send(giveaway);
  } catch (err) {
    console.log(err);
    res.send("Error while searching for wanted books in giveaway lists");
  }
});

export default router;
