import { DataSource } from "typeorm";
import dotenv from "dotenv";
import baseLogger from "../logger.js";
import { User } from "./entities/User.js";
import { Book } from "./entities/Book.js";
import { Genre } from "./entities/Genre.js";
import { Library } from "./entities/Library.js";
import { Permission } from "./entities/Permission.js";
import { Role } from "./entities/Role.js";
import { Review } from "./entities/Review.js";
import { Copy } from "./entities/Copy.js";
import { Librarian } from "./entities/Librarian.js";
dotenv.config();

const dataSource = new DataSource({
  // name: "default",
  type: "mysql",
  host: process.env.DB_HOST,
  port: 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [
    User,
    Review,
    Genre,
    Library,
    Permission,
    Role,
    Book,
    Copy,
    Librarian,
  ],
  synchronize: true,
});

export const initialize = async () => {
  // console.log(pro)
  return await dataSource
    .initialize()
    .then(() => {
      // console.log(process.env.DB_NAME);
      // console.log(process.env.DB_HOST);
      // console.log(process.env.DB_USERNAME);
      // console.log(process.env.DB_PASSWORD);

      console.log("Connected to DB!");
      baseLogger.info("Connected to DB!");
    })
    .catch((err) => {
      // console.log(process.env.DB_NAME);
      // console.log(process.env.DB_HOST);
      // console.log(process.env.DB_USERNAME);
      // console.log(process.env.DB_PASSWORD);
      console.error("Failed to connect to DB: ");
      console.log(err);
      baseLogger.error("Failed to connect to DB : " + err);
    });
};

export default dataSource;
