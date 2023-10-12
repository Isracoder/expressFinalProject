import express from "express";
import { authorize } from "../middlewares/auth/authorize.js";
const router = express.Router();
const routeName = "Review";
import { EntityTypes } from "../@types/entity.js";
import { paginate, paginateList } from "../controllers/paginate.js";
import { getBookbyId } from "../controllers/book.js";
import { Review } from "../db/entities/Review.js";
import { PaginateEntityList } from "../@types/page.js";
import dataSource from "../db/index.js";
import { User } from "../db/entities/User.js";
import { FileWatcherEventKind } from "typescript";
import { Book } from "../db/entities/Book.js";

// creating a new review for a certain user and book
router.post("/", async (req, res) => {
  try {
    const { text, imageUrl } = req.body;
    const bookId = parseInt(req.body.bookId);
    const stars = parseInt(req.body.stars);
    const userId = parseInt(req.body.userId);
    const createdAt = new Date();
    // look into making a validator for this to prevent repetition
    if (!bookId || !userId || isNaN(stars) || stars < 1 || stars > 5)
      res.send("Please make sure you've sent valid information");

    const user = await User.findOne({
      where: { id: userId },
    });
    const book = await Book.findOne({
      where: { id: bookId },
    });
    if (!user || !book) {
      res.send("Please send user and book ids that exist");
      return;
    }

    const review = new Review();
    review.text = text || "";
    review.imageUrl = imageUrl || "";
    review.stars = stars;
    review.user = user;
    review.book = book;

    await review.save();
  } catch (err) {
    console.log(err);
    res.send("An error occurred while creating a new review");
  }
});
//all reviews
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

// get all reviews for a certain user
router.get("/user", async (req, res) => {
  const userId = parseInt(req.body.id);

  const user = await dataSource
    .getRepository(User)
    .findOne({ where: { id: userId }, relations: ["reviews"] });

  if (!user) {
    res.send("User not found");
    return;
  } else if (!user.reviews) {
    console.log("that user has no reviews");
    res.send("That user has no reviews");
  }
  const payload: PaginateEntityList<Review> = {
    page: req.query.page?.toString() || "1",
    pageSize: req.query.pageSize?.toString() || "10",
    list: user.reviews,
  };

  paginateList(payload)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
      res.send("Error while finding reviews for this user");
    });
});

// book ? title = & id = &
router.post("/book");

// get all reviews for a certain book
router.get("/book", async (req, res) => {
  const bookid = req.body.id;
  if (!bookid) res.send("Please enter a book id");
  const reviews = await Review.find({ where: { id: bookid } });
  if (!reviews.length) res.send("No reviews where found for that book id");
  else {
    console.log("The reviews were found");
    res.send(reviews);
  }
});

router.put("/book/stars", async (req, res) => {
  const stars = parseInt(req.body.stars);
  const bookId = parseInt(req.body.bookId);
  const userId = parseInt(req.body.userId);
  if (!bookId || !userId)
    res.send("Please make sure you've sent the user and book ids");
  if (isNaN(stars) || stars < 1 || stars > 5)
    res.send("Enter a valid number for the star count, 1-5");
  const user = await User.findOne({
    where: { id: userId },
    relations: ["reviews"],
  });
  if (!user) {
    res.send("No user found by that id");
    return;
  }
  user.reviews.forEach((review) => {
    review.book.id == bookId ? (review.stars = stars) : 0;
  });

  await user.save();
});

router.put("/book/text", async (req, res) => {
  const text = req.body.text;
  const bookId = parseInt(req.body.bookId);
  const userId = parseInt(req.body.userId);
  // look into making a validator for this to prevent repetition
  if (!bookId || !userId)
    res.send("Please make sure you've sent the user and book ids");

  const user = await User.findOne({
    where: { id: userId },
    relations: ["reviews"],
  });
  if (!user) {
    res.send("No user found by that id");
    return;
  }
  user.reviews.forEach((review) => {
    review.book.id == bookId ? (review.text = text) : 0;
  });

  await user.save();
});

export default router;
