import express from "express";
import { authorize } from "../middlewares/auth/authorize.js";
import { EntityTypes } from "../@types/entity.js";
import { paginateList } from "../controllers/paginate.js";
import { createUser, getRecsFromFriends, login } from "../controllers/user.js";
import { authenticate } from "../middlewares/auth/authenticate.js";
import { validateUser } from "../middlewares/validation/validUser.js";
import { Library } from "../db/entities/Library.js";
import { User } from "../db/entities/User.js";
import { copyStatus } from "../db/entities/Copy.js";
import { PaginateEntityList } from "../@types/page.js";
import { Librarian } from "../db/entities/Librarian.js";
import { getReviewsAndName } from "../controllers/reviews.js";
import { getGenreCount } from "../controllers/genre.js";
import { PermissionName } from "../db/entities/Permission.js";
import { putImage, sendEmail } from "../controllers/aws.js";
import baseLogger from "../logger.js";
const router = express.Router();
const routeName = "User";
router.post("/", validateUser, async (req, res, next) => {
  try {
    // can be constructed more elegantly
    const user = await createUser(
      req.body.username,
      req.body.password,
      req.body.email,
      req.body.DOB,
      req.body.country,
      req.body.city
    );
    console.log(`${routeName} created successfully with values ${user}`);
    res.status(201).send(user);
  } catch (err) {
    console.log(err);
    next(err);
    // res.status(500).send("Error while creating a user");
  }
});

router.get("/", async (req, res, next) => {
  // res.send(`In ${routeName} router`);

  const entityName: keyof EntityTypes = routeName;
  // const payload = {
  //   page: req.query.page?.toString() || "1",
  //   pageSize: req.query.pageSize?.toString() || "10",
  //   dbName: entityName,
  // };

  // paginate(payload)
  //   .then((data) => {
  //     res.send(data);
  //   })
  //   .catch((error) => {
  //     console.error(error);
  //     res.status(500).send("Something went wrong");
  //   });

  // Both paginate and paginateList can be used , the latter however is more general and useful

  const users = await User.find();
  const payload: PaginateEntityList<User> = {
    page: req.query.page?.toString() || "1",
    pageSize: req.query.pageSize?.toString() || "10",
    list: users,
  };

  paginateList(payload)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
});

router.post("/login", (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log("in post methodj");
  login(email, password)
    .then((data) => {
      console.log("hi ho here's the data");
      res.cookie("token", data.token, {
        maxAge: 40 * 60 * 1000,
      });
      res.send(data);
    })
    .catch((err) => {
      console.log("error bad request");
      // res.status(401).send(err);
      next(err);
    });
});

router.get("/logout", authenticate, (req, res) => {
  // might need to add a blacklist of tokens for more security
  res.cookie("loginTime", "", { maxAge: -1 });
  res.cookie("token", "", { maxAge: -1 });
  res.send("logged out");
});

router.post(
  "/send-email",
  authenticate,
  authorize(PermissionName.adminAccess),
  async (req, res, next) => {
    try {
      const { recipient, subject, message } = req.body;
      if (!recipient || !subject || !message)
        return res.status(400).send("Please send requirements");
      await sendEmail(recipient, subject, message);

      res.status(200).send("Email sent successfully.");
    } catch (error) {
      console.log(error);
      // res.status(500).send("Error while sending email");
      next(error);
    }
  }
);
router.get("/data/genres", authenticate, async (req, res, next) => {
  try {
    console.log("in user data");
    let totalGenres: string[] = [];
    const count: number[] = [];
    const colors: string[] = [
      "red",
      "green",
      "blue",
      "orange",
      "yellow",
      "purple",
      "cyan",
      "lightgreen",
      "brown",
    ];
    const user = res.locals.user;
    if (!(user instanceof User))
      return res.status(400).send("Make sure you are logged in");
    const reviews = await getReviewsAndName(user.id);
    // return res.send(reviews);
    let genreCount: Map<string, number> = await getGenreCount(reviews);
    for (let key of genreCount) {
      totalGenres.push(key[0]);
      count.push(key[1]);
    }
    console.log(genreCount);
    res.render("genres", { totalGenres, count, colors });
  } catch (err) {
    console.log(err);
    // res.status(500).send("Error while rendering chart data");
    next(err);
  }
});

router.get("/data/books", authenticate, async (req, res, next) => {
  try {
    console.log("in user data");
    const months: string[] = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const count: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const colors: string[] = [
      "red",
      "green",

      "orange",
      "yellow",
      "purple",
      "cyan",
      "lightgreen",
      "brown",
      "blue",
      "maroon",
      "lavender",
      "beige",
    ];
    const user = res.locals.user;
    if (!(user instanceof User))
      return res.status(400).send("Make sure you are logged in");
    const reviews = await getReviewsAndName(user.id);
    const date = new Date();
    reviews.forEach((review) => {
      if (review.createdAt.getFullYear() == date.getFullYear())
        count[review.createdAt.getMonth()] += 1;
    });

    res.render("books", { months, count, colors });
  } catch (err) {
    console.log(err);
    next(err);
    // res.status(500).send("Error while rendering chart data");
  }
});

// maybe should be in users ?

// maybe not the best place for this route , users/available ? books/available ? copies/available
router.get("/books/available", authenticate, async (req, res, next) => {
  try {
    // const libraries = res.locals.libraries ; // one idea for this approach
    const user = res.locals.user;
    if (!(user instanceof User)) {
      throw { code: 400, reason: "Make sure the user is correctly logged in" };
    }
    const libraries = await Library.find({
      where: { city: user.city },
      relations: ["copies"],
    });
    const wantedBooks = (
      await User.findOne({
        where: { id: user.id },
        relations: ["wantedBooks"],
      })
    )?.wantedBooks;
    if (!wantedBooks) {
      res.send("User doesn't have any books on the want-list currently");
      return;
    }
    let available: Object[] = [];
    libraries.forEach((library) => {
      library.copies.forEach((copy) => {
        if (copy.status == copyStatus.available) {
          wantedBooks.forEach((book) => {
            if (book.id == copy.book.id) {
              available.push({
                copyId: copy.id,
                status: copy.status,
                title: book.title,
                author: book.author,
                library: library.name,
                city: library.city,
              });
            }
          });
        }
      });
    });
    if (!available.length)
      res.send("No copies that the user wants are currently available");
    console.log("copies were found");
    res.send(available); // consider paginating the result
  } catch (err) {
    console.log(err);
    next(err);
    baseLogger.error(
      "An error occurred while searching for available wanted books"
    );
  }
});

router.post("/friends", authenticate, async (req, res, next) => {
  try {
    const user = res.locals.user;
    if (!(user instanceof User)) {
      res.send("The user must be signed in");
      return;
    }
    const friendId = parseInt(req.body.id);
    if (!friendId) {
      res.send("Make sure the user id is a number");
      return;
    }
    if (friendId === user.id) {
      res.send("You cannot be friends with yourself");
      return;
    }
    const friend = await User.findOne({
      where: { id: friendId },
      relations: ["friends"],
    });

    const loadedUser = await User.findOne({
      where: { id: user.id },
      relations: ["friends"],
    });
    if (!friend || !loadedUser) {
      res.send("No friend or user was found by that id");
      return;
    }
    if (loadedUser.friends && loadedUser.friends.includes(friend))
      res.send("You are already friends");
    if (loadedUser.friends) loadedUser.friends.push(friend);
    else loadedUser.friends = [friend];
    // adding to both sides
    if (friend.friends) friend.friends.push(loadedUser);
    else friend.friends = [loadedUser];

    await loadedUser.save();
    await friend.save();
    res.send("Friend added successfully");
  } catch (err) {
    console.log(err);
    baseLogger.error("Error while adding a friend");
    next(err);
  }
});

router.delete("/friends", authenticate, async (req, res, next) => {
  try {
    const user = res.locals.user;
    if (!(user instanceof User)) {
      res.send("The user must be signed in");
      return;
    }
    const friendId = parseInt(req.body.id);
    if (!friendId) {
      res.send("Make sure the user id is a number");
      return;
    }
    if (friendId === user.id) {
      res.send("You aren't friends with yourself");
      return;
    }
    const friend = await User.findOne({
      where: { id: friendId },
      relations: ["friends"],
    });

    const loadedUser = await User.findOne({
      where: { id: user.id },
      relations: ["friends"],
    });
    if (!friend || !loadedUser) {
      res.send("No friend or user was found by that id");
      return;
    }

    if (loadedUser.friends)
      loadedUser.friends = loadedUser.friends.filter(
        (frnd) => frnd.id !== friend.id
      );

    // removing from both sides
    if (friend.friends)
      friend.friends = friend.friends.filter(
        (frnd) => frnd.id !== loadedUser.id
      );

    await loadedUser.save();
    await friend.save();
    res.send("Friend removed successfully");
  } catch (err) {
    console.log(err);
    baseLogger.error("Error while deleting a friend");
    next(err);
  }
});
// seems to work
router.get("/friend-recs", authenticate, async (req, res, next) => {
  try {
    const user = res.locals.user;
    if (!(user instanceof User)) throw "Get valid user from login";
    const loadedUser = await User.findOne({
      where: { id: user.id },
      relations: ["friends", "reviews"],
    });
    const userFriends = loadedUser?.friends;
    let alreadyRead: number[] = [];
    loadedUser?.reviews.forEach((rev) => alreadyRead.push(rev.book.id));
    console.log(`Already read  : ${alreadyRead}`);
    if (!userFriends) {
      res.send(
        "You currently haven't added any friends to get recommendations from"
      );
      return;
    }

    let bookRecs = await getRecsFromFriends(userFriends, alreadyRead);
    if (!bookRecs) {
      res.send("No book recommendations from friends");
    } else res.send(bookRecs);
  } catch (error) {
    console.log(error);
    baseLogger.error("Error while getting recommendations");
    next(error);
  }
});

// maybe add a transaction manager in friend routes
// The current friend relationship is a mix of friends and followers for simplicity
//I don't need their permission to add them as a friend and adding them to my friends adds me to their friends
// removing someone from my friend list removes me from their friend list
router.get("/friends", authenticate, async (req, res, next) => {
  try {
    const user = res.locals.user;
    if (!(user instanceof User)) {
      res.send("The user must be signed in");
      return;
    }
    const loadedUser = await User.findOne({
      where: { id: user.id },
      relations: ["friends"],
    });
    if (!loadedUser) {
      res.send("Are you logged in correctly?");
    } else if (!loadedUser.friends)
      res.send("This user hasn't added any friends");
    else res.send(loadedUser.friends);

    // res.send(user);
  } catch (err) {
    console.log(err);
    baseLogger.error("Error while getting friends");
    next(err);
  }
});

router.get("/giveaway", authenticate, async (req, res, next) => {
  try {
    const user = res.locals.user;
    if (!(user instanceof User)) {
      throw "Get valid user from login !";
    }
    const wantedList = (
      await User.findOne({ where: { id: user.id }, relations: ["wantedBooks"] })
    )?.wantedBooks;
    console.log(`user id : ${user.id}`);
    if (!wantedList) {
      res.send("You don't have a wanted list to cross-reference");
      return;
    }
    const usersInSameCity = await User.find({
      where: { city: user.city },
      relations: ["giveawayBooks"],
    });
    const giveaway: Object[] = [];
    wantedList.forEach((wantedBook) => {
      console.log(`Wanted book ${wantedBook.id}`);
      usersInSameCity.forEach((person) => {
        if (person.id != user.id) {
          person.giveawayBooks.forEach((book) => {
            if (book.id == wantedBook.id) {
              giveaway.push({
                user: person.username,
                city: person.city,
                "giveaway-title": wantedBook.title,
                author: wantedBook.author,
              });
            }
          });
        }
      });
    });
    if (!giveaway.length)
      res.send("No users in your city are giving away books that you want");
    else res.send(giveaway);
  } catch (err) {
    console.log(err);
    baseLogger.error(
      "Error while searching for wanted books in giveaway lists"
    );
    next(err);
  }
});

router.put("/image", authenticate, async (req, res, next) => {
  try {
    if (!req.body.img) {
      throw { code: 400, reason: "Invalid requirements" };
    }
    const data = await putImage(
      req.body.img,
      res.locals.user.id,
      "user-images-gsg"
    );
    console.log(data);
    console.log("Successfull");
    res.send(data);
  } catch (error) {
    console.log(error);
    next(error);
    // res.send("Error while trying to add book image to s3 bucket");
  }
});

export default router;
