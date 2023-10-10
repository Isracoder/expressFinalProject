import { DataSource } from "typeorm";
import dotenv from "dotenv";
import baseLogger from "../logger.js";
import { User } from "./entities/User.js";
import { Book } from "./entities/Book.js";
import { Genre } from "./entities/Genre.js";
import { Library } from "./entities/Library.js";
import { Permission } from "./entities/Permission.js";
import { Role } from "./entities/Role.js";
dotenv.config();

const dataSource = new DataSource({
  name: "default",
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Book, Genre, Library, Permission, Role],
  synchronize: true,
  // logging: true,
});

export const initialize = async () =>
  await dataSource
    .initialize()
    .then(() => {
      console.log("Connected to DB!");
      baseLogger.info("Connected to DB!");
    })
    .catch((err) => {
      console.error("Failed to connect to DB: " + err);
      baseLogger.error("Failed to connect to DB : " + err);
    });

export default dataSource;
