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
import { authenticate } from "../middlewares/auth/authenticate.js";
import { text } from "stream/consumers";
import baseLogger from "../logger.js";

// creating a new review for a certain user and book
router.post("/", authenticate, async (req, res, next) => {
  try {
    const { text, imageUrl } = req.body;
    const bookId = parseInt(req.body.bookId);
    let stars = req.body.stars;
    if (typeof stars == "string") stars = parseFloat(stars);
    const user = res.locals.user;
    if (!(user instanceof User)) {
      res.send("Make sure you're logged in");
      return;
    }
    // look into making a validator for this to prevent repetition
    if (!bookId || isNaN(stars) || stars < 1 || stars > 5) {
      res.send("Please make sure you've sent valid information");
      return;
    }

    const book = await Book.findOne({
      where: { id: bookId },
    });
    if (!user || !book) {
      res.send("Please send user and book ids that exist");
      return;
    }
    const reviews = await Review.find({ relations: ["user", "book"] });
    let similarReview = reviews?.filter(
      (rev) => rev.user.id == user.id && rev.book.id == book.id
    );
    if (similarReview.length) {
      res.send(
        "You already have a review for that book , wrong route try editing"
      );
      return;
    }
    const review = new Review();
    review.text = text || "";
    review.imageUrl = imageUrl || "";
    review.stars = stars;
    review.user = user;
    review.book = book;
    review.createdAt = new Date();
    await review.save();
    res.send("Review created successfully");
  } catch (err) {
    console.log(err);
    baseLogger.error("An error occurred while creating a new review");
    next(err);
  }
});
//all reviews
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
      // res("Something went wrong");
    });
});

// get all reviews for a certain user
router.get("/user", async (req, res, next) => {
  const userId = parseInt(req.body.id);
  if (!userId) {
    res.send("Please enter a valid user id");
    return;
  }
  const user = await User.findOne({
    where: { id: userId },
    relations: ["reviews"],
  });

  if (!user) {
    res.send("User not found");
    return;
  } else if (!user.reviews || !user.reviews.length) {
    console.log("that user has no reviews");
    res.send("That user has no reviews");
    return;
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
      next(err);
      // res.send("Error while finding reviews for this user");
    });
});

// book ? title = & id = &
router.post("/book");

// get all reviews for a certain book
router.get("/book", async (req, res, next) => {
  try {
    const bookid = req.body.id;
    if (!bookid) res.send("Please enter a book id");

    const reviews = await Review.find({ relations: ["book"] });
    const allReviews = reviews.filter((review) => review.book.id == bookid);
    if (!allReviews.length)
      console.log("No reviews where found for that book id");
    res.send(allReviews);
  } catch (err) {
    next(err);
  }
});

router.put("/book/stars", authenticate, async (req, res, next) => {
  try {
    const stars = parseFloat(req.body.stars);

    // const userId = parseInt(req.body.userId);
    const authUser = res.locals.user;
    if (!(authUser instanceof User)) {
      res.send("Please make sure a valid user is logged in");
      return;
    }

    if (!req.body.bookId || !stars)
      res.send("Please make sure you've sent the stars and book ids");
    const book = await getBookbyId(req.body.bookId);
    if (isNaN(stars) || stars < 1 || stars > 5)
      res.send("Enter a valid number for the star count, 1-5");
    const reviews = await Review.find({
      // where: { book.id:  },
      relations: ["user", "book"],
    });
    if (!reviews) {
      res.send("No reviews found");
      return;
    }

    for (let review of reviews) {
      if (review.book.id == book.id && review.user.id == authUser.id) {
        review.stars = stars;
        await review.save();
      }
    }
    // reviews.forEach(async (review) => {

    // });
    res.send("User review updated successfully");
  } catch (err) {
    console.log(err);
    baseLogger.error("Problem updating review");
    next(err);
  }
});

router.put("/book/text", authenticate, async (req, res, next) => {
  try {
    const text = req.body.text;
    // const userId = parseInt(req.body.userId);
    const authUser = res.locals.user;
    if (!(authUser instanceof User) || !req.body.bookId || !text) {
      throw { code: 400, reason: "Invalid credentials or requirements" };
    }

    const book = await getBookbyId(req.body.bookId);

    const reviews = await Review.find({
      // where: { book.id:  },
      relations: ["user", "book"],
    });
    if (!reviews) {
      res.send("No reviews found");
      return;
    }
    for (let review of reviews) {
      if (review.book.id == book.id && review.user.id == authUser.id) {
        review.text = text;
        await review.save();
      }
    }
    // reviews.forEach(async (review) => {
    // });

    res.send("Review updated successfully");
  } catch (err) {
    console.log(err);
    baseLogger.error("Error while updating review");
    next(err);
  }
});

export default router;
