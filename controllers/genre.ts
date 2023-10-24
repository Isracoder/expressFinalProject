import { Genre } from "../db/entities/Genre.js";
import { Review } from "../db/entities/Review.js";
import { getBookbyId } from "./book.js";
import dataSource from "../db/index.js";

const getGenreByName = async (name: string) => {
  // const genre = await Genre.findOne({ where: { name: name } });
  const genre = await dataSource
    .createQueryBuilder()
    .select("genre")
    .from(Genre, "genre")
    .where("LOWER(genre.name) = LOWER(:name)", { name })
    .getOne();
  if (!genre) throw "No genre by that name";
  else return genre;
};

const getBookGenres = async (bookId: number) => {
  const book = await getBookbyId(bookId);
  return book.genres;
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
