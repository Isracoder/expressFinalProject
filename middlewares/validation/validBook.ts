import express from "express";

const validYear = (year: number) => {
  const date = new Date();

  if (isNaN(year) || year > date.getFullYear() || year < 1700) {
    return false;
  }
  return true;
};

const validateBook = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const values = ["author", "title", "language", "pubYear"];
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

  if (!validYear(parseInt(user.pubYear))) {
    errorList.push("Publication Year is not Valid");
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

export { validateBook };
