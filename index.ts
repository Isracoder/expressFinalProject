import "dotenv/config";
import express from "express";
import db from "./db/index.js";
import { initialize } from "./db/index.js";
import baseLogger from "./logger.js";
import { error404Handler } from "./middlewares/errorHandlers/genericHandler.js";
import userRouter from "./routes/users.js";
import bookRouter from "./routes/books.js";
import genresRouter from "./routes/genres.js";
import librariesRouter from "./routes/libraries.js";
import permissionsRouter from "./routes/permissions.js";
import rolesRouter from "./routes/roles.js";
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server UP!");
});

app.use("/users", userRouter);
app.use("/books", bookRouter);
app.use("/genres", genresRouter);
app.use("/libraries", librariesRouter);
app.use("/permissions", permissionsRouter);
app.use("/roles", rolesRouter);
app.use(error404Handler);

app.use((req, res) => {
  res.status(404).send("You requested something I don't have :(");
});

app.listen(PORT, () => {
  console.log(`App is running and Listening on port ${PORT}`);
  baseLogger.info(`App is listening on port ${PORT}`);
  initialize();
});
