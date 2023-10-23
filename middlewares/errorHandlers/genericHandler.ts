import express from "express";
import baseLogger from "../../logger.js";

const errorLogger = (
  error: any,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  baseLogger.error("Something went wrong [From middleware]:");
  baseLogger.error(error.message || error);
  next(error);
};

const errorSender = (
  error: any,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  res
    .status(error.code || 500)
    .send(error.reason || "Something went wrong :( ");
};

const error404Handler = (req: express.Request, res: express.Response) => {
  res.status(404).send("Invalid Request Path!");
};

export { errorLogger, errorSender, error404Handler };
