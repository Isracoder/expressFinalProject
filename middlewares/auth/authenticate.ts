import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../../db/entities/User.js";

const authenticate = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  console.log("in authenticate");
  const token = req.headers["authorization"] || "";
  console.log(req.headers);
  let tokenIsValid;
  try {
    // tokenIsValid = jwt.verify(token, process.env.SECRET_KEY || '');
    tokenIsValid = jwt.verify(token, process.env.SECRET_KEY || "");
  } catch (error) {
    res.send("an error occurred while authenticating");
  }

  if (tokenIsValid) {
    const decoded = jwt.decode(token, { json: true });
    const user = await User.findOneBy({ email: decoded?.email || "" });
    res.locals.user = user;
    next();
  } else {
    res.status(401).send("You are Unauthorized!");
  }
};

export { authenticate };
