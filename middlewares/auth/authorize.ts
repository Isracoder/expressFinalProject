import express from "express";
import { NSUser } from "../../@types/user.js";
import { Role, RoleType } from "../../db/entities/Role.js";
import { User } from "../../db/entities/User.js";
import { FileWatcherEventKind } from "typescript";
import { EntityNotFoundError } from "typeorm";

const authorize = (api: string) => {
  return async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const user = res.locals.user;
    if (!(user instanceof User)) {
      next({
        code: 401,
        codeMeaning: "Invalid login",
        reason: "Not logged in as a valid user",
      });
      return;
    }
    const roles = user.roles;
    const adminRole = await Role.find({ where: { name: RoleType.admin } });
    // currently allow admins to do everything
    if (adminRole instanceof Role && roles.includes(adminRole)) {
      next();
      return;
    }
    let found = false;
    user.roles.forEach((role) => {
      const permissions = role.permisssions;
      if (permissions.filter((p) => p.name === api).length > 0) {
        console.log("Permission granted");
        found = true;
        next();
        return;
      }
    });
    if (!found) {
      next({
        code: 403,
        codeMeaning: "INVALID_CREDENTIALS",
        reason: "You don't have the permission to access this resource",
      });
      // res
      //   .status(403)
      //   .send("You don't have the permission to access this resource!");
    }
  };
};

export { authorize };
