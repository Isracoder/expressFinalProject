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
  const errorList: string[] = [];
  // const errorList = values.map(key => !user[key] && `${key} is Required!`).filter(Boolean);
  values.forEach((key) => {
    if (!user[key]) {
      errorList.push(`${key} is Required!`);
    }
  });

  if (errorList.length) {
    return next({
      code: 400,
      reason: "Invalid_Input",
      message: errorList.join(" "),
    });
  }

  if (!isEmail.default(user.email)) {
    errorList.push("Email is not Valid");
  }

  if (user.password?.length < 6) {
    errorList.push("Password should contain at least 6 characters!");
  }
  if (errorList.length) {
    next({
      code: 400,
      reason: "INVALID_INPUT",
      message: errorList.join(", "),
    });
  } else {
    next();
  }
};

export { validateUser };
