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
  if (typeof roleId === "string") roleId = parseInt(roleId);
  if (!roleId) throw "Not a valid Role id";
  const role = await Role.findOneBy({ id: roleId });
  if (!role) {
    throw "No Role with that id in our database";
  }
  return role;
};

const getRolebyName = async (roleName: RoleType) => {
  if (!Object.values(RoleType).includes(roleName)) throw "Invalid roleName";
  const role = await Role.findOneBy({ name: roleName });
  if (role) return role;
  throw "No role with that name in the db"; // should i return -1 ?
};

const getPermissionbyName = async (permName: PermissionName) => {
  if (!Object.values(PermissionName).includes(permName))
    throw "Invalid permission name";
  const permission = await Permission.findOneBy({ name: permName });
  if (permission) return permission;
  throw "No permission with that name in the db"; // should i return -1 ?
};

const getPermissionbyId = async (permId: number | string) => {
  if (typeof permId === "string") permId = parseInt(permId);
  if (!permId) throw "Not a valid Permission id";
  const permission = await Permission.findOneBy({ id: permId });
  if (!permission) {
    throw "No Permission with that id in our database";
  }
  return permission;
};
export { getRolebyName, getRolebyId, getPermissionbyId, getPermissionbyName };
