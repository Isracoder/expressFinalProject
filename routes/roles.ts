import express from "express";
import { authorize } from "../middlewares/auth/authorize.js";
const router = express.Router();
const routeName = "Role";
import { EntityTypes } from "../@types/entity.js";
import { paginate } from "../controllers/paginate.js";
import { Role, RoleType } from "../db/entities/Role.js";
import { addRoleToUser, removeRoleFromUser } from "../controllers/user.js";
import { authenticate } from "../middlewares/auth/authenticate.js";
import { PermissionName } from "../db/entities/Permission.js";
import { getRolebyName } from "../controllers/role&permissions.js";

// should authorize so only an admin can add new roles
router.post(
  "/",
  authenticate,
  authorize(PermissionName.adminAccess),
  async (req, res) => {
    try {
      if (!Object.values(RoleType).includes(req.body.name))
        throw "Invalid role name";
      const role = new Role();
      role.name = req.body.name;
      await role.save();
      res.send(`${routeName} created successfully`);
    } catch (error) {
      console.log(error);
      res.send("Error while creating role");
    }
  }
);

// gets all roles
router.get("/", (req, res) => {
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
      res.status(500).send("Something went wrong");
    });
});

// gets permissions for a specific role
router.get("/permissions", async (req, res) => {
  try {
    const roleName = req.body.name;
    const role = await getRolebyName(roleName);
    console.log("role found , here are the permissions");
    res.send(role.permisssions);
  } catch (err) {
    console.log(err);
    res.send("Error while getting permissions for that role");
  }
});

// assigns role to user
router.put(
  "/user",
  authenticate,
  authorize(PermissionName.adminAccess),
  async (req, res) => {
    try {
      let libraryId;
      if (req.body.roleName == RoleType.librarian)
        libraryId = req.body.libraryId;
      const user = await addRoleToUser(
        req.body.roleName,
        req.body.id,
        libraryId
      );
      res.send(`Role added successfully to user ` + user);
    } catch (err) {
      console.log(err);
      res.send("Error while assigning role to user");
    }
  }
);

router.delete(
  "/user",
  authenticate,
  authorize(PermissionName.adminAccess),
  async (req, res) => {
    try {
      let libraryId;
      if (req.body.roleName == RoleType.librarian)
        libraryId = req.body.libraryId;
      const user = await removeRoleFromUser(
        req.body.roleName,
        req.body.id,
        libraryId
      );
      res.send("Successfully deleted role from user" + user);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send("Something went wrong trying to delete a role from a user");
    }
  }
);

export default router;
