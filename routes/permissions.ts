import express from "express";
import { authorize } from "../middlewares/auth/authorize.js";
const router = express.Router();
const routeName = "Permission";

import { EntityTypes } from "../@types/entity.js";
import { paginate } from "../controllers/paginate.js";
import { authenticate } from "../middlewares/auth/authenticate.js";
import { Permission, PermissionName } from "../db/entities/Permission.js";
import {
  getPermissionbyId,
  getPermissionbyName,
  getRolebyName,
} from "../controllers/role&permissions.js";
import baseLogger from "../logger.js";

// posts a new permission
router.post(
  "/",
  authenticate,
  authorize(PermissionName.adminAccess),
  async (req, res, next) => {
    try {
      const name = req.body.name;
      if (!Object.values(PermissionName).includes(name))
        throw "Invalid permission name";
      const permission = new Permission();
      permission.name = name;
      await permission.save();
      res.send(`${routeName} created successfully`);
    } catch (err) {
      console.log(err);
      baseLogger.error("Error creating new permission in db");
      next(err);
    }
  }
);
// gets all permissions
router.get("/", (req, res, next) => {
  // res.send(`In ${routeName} router`);

  const entityName: keyof EntityTypes = routeName;
  const payload = {
    page: req.query.page?.toString() || "1",
    pageSize: req.query.pageSize?.toString() || "10",
    dbName: entityName,
  };

  paginate(payload)
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      console.error(error);
      // res.status(500).send("Something went wrong");
      next(error);
    });
});

// adds a permission to a role , only admin
router.put(
  "/role",
  authenticate,
  authorize(PermissionName.adminAccess),
  async (req, res, next) => {
    try {
      const roleName = req.body.roleName;
      const permName = req.body.permission;
      const permission = await getPermissionbyName(permName);
      const role = await getRolebyName(roleName);
      role.permisssions.push(permission);
      await role.save();
      res.send(role);
    } catch (err) {
      console.log(err);
      // res.send("Error while adding a permission to a role");
      next(err);
    }
  }
);

export default router;
