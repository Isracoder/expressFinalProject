import "dotenv/config";
import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

app.get("/", (req, res) => {
  //   res.json({ msg: "Hello from express" });
  res.send("hello ,  express app ");
});

app.listen(PORT, () => {
  // logger(`App is listening on port ${PORT}`);
  console.log(`App is listening on port ${PORT}`);
  // initDB();
});

// process.on("SIGHUP", () => {
//   server.close();
// });
