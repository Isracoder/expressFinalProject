import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../../db/entities/User.js";
import { Library } from "../../db/entities/Library.js";
import dotenv from "dotenv";
dotenv.config();

const authenticate = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  console.log("in authenticate");
  let tokenIsValid;
  let token;
  try {
    token = req.headers["authorization"] || req.cookies["token"];
    if (!token) throw "Token not sent";
    // tokenIsValid = jwt.verify(token, process.env.SECRET_KEY || '');
    tokenIsValid = jwt.verify(token, process.env.SECRET_KEY || "");
  } catch (error) {
    console.error(error);
    console.log(error);
    next({
      code: 401,
      codeMeaning: "UnAuthenticated",
      reason: "Invalid authentication token",
    });
    // res
    //   .status(500)
    //   .send(
    //     "an error occurred while authenticating , please send a correct token"
    //   );
    return;
  }

  if (tokenIsValid) {
    console.log("token is valid");
    const decoded = jwt.decode(token, { json: true });
    const user = await User.findOneBy({ email: decoded?.email || "" });
    if (!user) res.status(400).send("No user found , authentication failed");
    res.locals.user = user;
    res.locals.libraries = user?.libraries;
    next();
  } else {
    // res.status(401).send("You are Unauthorized!");
    next({
      code: 401,
      codeMeaning: "UnAuthenticated",
      reason: "Invalid authentication token",
    });
  }
};

export { authenticate };
