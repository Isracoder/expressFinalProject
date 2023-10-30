import { Review } from "../db/entities/Review.js";
import dataSource from "../db/index.js";

const getReviewsAndName = async (userId: number) => {
  try {
    const reviews = await dataSource
      .getRepository(Review)
      .createQueryBuilder("review")
      .leftJoinAndSelect("review.user", "user")
      .leftJoinAndSelect("review.book", "book")
      .where("user.id = :userId", { userId })
      .getMany();
    return reviews;
  } catch (err) {
    console.log(err);
    throw { code: 500, reason: "Problem while getting reviews for that user" };
  }
};

export { getReviewsAndName };
