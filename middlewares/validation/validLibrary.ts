import { error } from "console";
import express from "express";
import { LibraryType } from "../../db/entities/Library.js";

const validateLibrary = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const values = ["name", "type", "country", "city"];
  const library = req.body;
  const errorList = [];

  values.forEach((key) => {
    if (!library[key]) {
      return errorList.push(`${key} is Required!`);
    }
  });

  if (library["type"] && !Object.keys(LibraryType).includes(library.type)) {
    errorList.push("Library type is unknown!");
  }

  if (errorList.length) {
    res.status(400).send(errorList);
  } else {
    next();
  }
};

export { validateLibrary };
