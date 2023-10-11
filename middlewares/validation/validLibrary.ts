import { error } from "console";
import express from "express";

const validateLibrary = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const values = ["name", "type", "country", "city"];
  const user = req.body;
  const errorList = [];

  values.forEach((key) => {
    if (!user[key]) {
      return errorList.push(`${key} is Required!`);
    }
  });

  if (
    user["type"] &&
    !["public", "private", "school", "bookstore", "university"].includes(
      user.type
    )
  ) {
    errorList.push("Library type is unknown!");
  }

  if (errorList.length) {
    res.status(400).send(errorList);
  } else {
    next();
  }
};

export { validateLibrary };
