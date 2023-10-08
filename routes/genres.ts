import express from "express";
import { authorize } from "../middlewares/auth/authorize.js";
const router = express.Router();
const routeName = "Genre";

router.get("/", (req, res) => {
  res.send(`In ${routeName} router`);
});

export default router;
