import { Genre } from "../db/entities/Genre.js";
import { Review } from "../db/entities/Review.js";
import { getBookbyId } from "./book.js";
import dataSource from "../db/index.js";

const getGenreByName = async (name: string) => {
  // const genre = await Genre.findOne({ where: { name: name } });
  try {
    const genre = await dataSource
      .createQueryBuilder()
      .select("genre")
      .from(Genre, "genre")
      .where("LOWER(genre.name) = LOWER(:name)", { name })
      .getOne();
    if (!genre) throw { code: 404, reason: "No genre by that name" };
    return genre;
  } catch (err) {
    throw err;
  }
};

const getBookGenres = async (bookId: number) => {
  try {
    const book = await getBookbyId(bookId);
    return book.genres;
  } catch (err) {
    throw err;
  }
};

const getGenreCount = async (reviews: Review[]) => {
  try {
    const curDate = new Date();
    let genreCount: Map<string, number> = new Map();

    for (const review of reviews) {
      if (
        review.createdAt.getMonth() === curDate.getMonth() &&
        review.createdAt.getFullYear() === curDate.getFullYear()
      ) {
        const genres = await getBookGenres(review.book.id);
        genres.forEach((genre) => {
          let val = genreCount.get(genre.name);
          if (!val) val = 1;
          else val += 1;
          genreCount.set(genre.name, val);
        });
      }
    }
    console.log("returning from genre Count");
    return genreCount;
  } catch (err) {
    throw err;
  }
};

export { getGenreByName, getBookGenres, getGenreCount };
