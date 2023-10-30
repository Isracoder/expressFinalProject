import { User } from "../db/entities/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
// import { Profile } from "../db/entities/Profile.js";
import datasource from "../db/index.js";
import dotenv from "dotenv";
import { Role, RoleType } from "../db/entities/Role.js";
import { Library } from "../db/entities/Library.js";
import { Book } from "../db/entities/Book.js";
import { Librarian } from "../db/entities/Librarian.js";
import { Permission, PermissionName } from "../db/entities/Permission.js";
dotenv.config();

const getRolebyId = async (roleId: number | string) => {
  try {
    if (typeof roleId === "string") roleId = parseInt(roleId);
    if (!roleId) throw { code: 400, reason: "Not a valid Role id" };
    const role = await Role.findOneBy({ id: roleId });
    if (!role) {
      throw { code: 404, reason: "No Role with that id in our database" };
    }
    return role;
  } catch (err) {
    throw err;
  }
};

const getRolebyName = async (roleName: RoleType) => {
  try {
    if (!Object.values(RoleType).includes(roleName)) throw "Invalid roleName";
    const role = await Role.findOneBy({ name: roleName });
    if (role) return role;
    throw { code: 404, reason: "No role with that name in the db" };
  } catch (err) {
    throw err;
  }
};

const getPermissionbyName = async (permName: PermissionName) => {
  try {
    if (!Object.values(PermissionName).includes(permName))
      throw { code: 400, reason: "Invalid permission name" };
    const permission = await Permission.findOneBy({ name: permName });
    if (permission) return permission;
    throw { code: 404, reason: "No permission with that name in the db" };
  } catch (err) {
    throw err;
  }
};

const getPermissionbyId = async (permId: number | string) => {
  try {
    if (typeof permId === "string") permId = parseInt(permId);
    if (!permId) throw { code: 400, reason: "Not a valid Permission id" };
    const permission = await Permission.findOneBy({ id: permId });
    if (!permission) {
      throw { code: 404, reason: "No Permission with that id in our database" };
    }
    return permission;
  } catch (err) {
    throw err;
  }
};
export { getRolebyName, getRolebyId, getPermissionbyId, getPermissionbyName };
