import "dotenv/config";
import express from "express";
import db from "./db/index.js";
import baseLogger from "./logger.js";
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server UP!");
});

app.use((req, res) => {
  res.status(404).send("You requested something I don't have :(");
});

app.listen(PORT, () => {
  console.log(`App is running and Listening on port ${PORT}`);
  baseLogger.info(`App is listening on port ${PORT}`);
  db.initialize();
});
