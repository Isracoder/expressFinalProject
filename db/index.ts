import { DataSource } from "typeorm";
import dotenv from "dotenv";
dotenv.config();

const dataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [],
  synchronize: true,
  logging: true,
});

export const initialize = async () =>
  await dataSource
    .initialize()
    .then(() => {
      console.log("Connected to DB!");
    })
    .catch((err) => {
      console.error("Failed to connect to DB: " + err);
    });

export default dataSource;
