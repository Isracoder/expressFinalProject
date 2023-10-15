import express from "express";
import { NSUser } from "../../@types/user.js";
import { Role, RoleType } from "../../db/entities/Role.js";
import { User } from "../../db/entities/User.js";
import { FileWatcherEventKind } from "typescript";

const authorize = (api: string) => {
  return async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const user = res.locals.user;
    if (!(user instanceof User)) throw "Not logged in";
    const roles = user.roles;
    const adminRole = await Role.find({ where: { name: RoleType.admin } });
    // currently allow admins to do everything
    if (adminRole instanceof Role && roles.includes(adminRole)) next();
    // const librarianRole = await Role.find({
    //   where: { name: RoleType.librarian },
    // });

    // if (librarianRole instanceof Role && roles.includes(librarianRole)) {
    // }
    user.roles.forEach((role) => {
      const permissions = role.permisssions;
      if (permissions.filter((p) => p.name === api).length > 0) {
        console.log("Permission granted");
        next();
      }
    });

    res
      .status(403)
      .send("You don't have the permission to access this resource!");
  };
};

export { authorize };
