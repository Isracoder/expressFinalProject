import express from "express";
import isEmail from "validator/lib/isEmail.js";

const validateUser = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  // maybe use year , month , day instead of dob and check validity
  const values = ["username", "email", "password", "DOB", "country", "city"];
  const user = req.body;
  const errorList = [];
  // const errorList = values.map(key => !user[key] && `${key} is Required!`).filter(Boolean);
  values.forEach((key) => {
    if (!user[key]) {
      return errorList.push(`${key} is Required!`);
    }
  });

  if (!isEmail.default(user.email)) {
    errorList.push("Email is not Valid");
  }

  if (user.password.length < 6) {
    errorList.push("Password should contain at least 6 characters!");
  }

  // if (!["kid", "adult", "teen", "admin", "librarian"].includes(user.type)) {
  //   errorList.push("User type unknown!");
  // }

  if (errorList.length) {
    res.status(400).send(errorList);
  } else {
    next();
  }
};

export { validateUser };
