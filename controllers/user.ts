import { User } from "../db/entities/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
// import { Profile } from "../db/entities/Profile.js";
import datasource from "../db/index.js";
import dotenv from "dotenv";
import { Role } from "../db/entities/Role.js";
dotenv.config();

const login = async (email: string, password: string) => {
  console.log("in login");
  try {
    const user = await User.findOneBy({
      email: email,
    });

    const passwordMatching = await bcrypt.compare(
      password,
      user?.password || ""
    );
    // const secretKey = "kdfjkdjfkd";
    if (user && passwordMatching) {
      console.log("found user and the password matches");
      // console.log(`process.env.escret key ${process.env.SECRET_KEY}`);
      // const token = "jdfd";
      const token = jwt.sign(
        {
          email: user.email,
          username: user.username,
          id: user.id, // user doesn't have a display name property
        },
        process.env.SECRET_KEY || "",
        // secretKey || "",
        {
          expiresIn: "2w", // 2 weeks
        }
      );
      // console.log(`token in controller  ${token}`);

      return token;
    } else {
      throw "Invalid Username or password!";
    }
  } catch (error) {
    throw "Invalid Username or password!";
  }
};

// maybe add a profile as a separate from the user ?
const createUser = async (
  userName: string,
  password: string,
  email: string,
  DOB: Date,
  firstName?: string,
  lastName?: string
) => {
  try {
    const user = new User();
    // const profile = new Profile();
    user.username = userName;
    user.email = email;
    user.password = password;
    user.DOB = DOB;
    // profile.firstName = firstName;
    // profile.lastName = lastName;
    // profile.dateOfBirth = new Date(dateOfBirth);
    // await profile.save();
    // user.profile = profile;
    // await user.save();
    await datasource.manager.transaction(async (transactionManager) => {
      //   await transactionManager.save(profile);
      await transactionManager.save(user);
    });
    console.log("after transaction manager");
    return user;
  } catch (error) {
    console.log(error);
    throw "something went wrong";
  }
};

const addRoleToUser = async (roleName: Role["name"], id: string | number) => {
  try {
    const role = await Role.findOneBy({ name: roleName });

    const user = await User.findOneBy({ id: Number(id) });
    if (role && user) {
      console.log("user found and role found");
      try {
        user.roles.push(role);
        await user.save();
        console.log("user Updated");
        return user;
      } catch (error) {
        console.log(error);
        throw "something went wrong";
      }
      // return "everything okay" ;
    } else {
      // console.log(error);
      console.log("not able to find role and user");
      throw "something went wrong";
    }
  } catch (error) {
    console.log(error);
    throw "something went wrong";
  }
};

const getUserById = async (userId: number | string) => {
  if (typeof userId == "string") userId = parseInt(userId);
  if (!userId) throw "Not a valid input for the user id";
  const user = await User.findOneBy({ id: userId });
  if (user) return user;
  throw "User not found";
};

export { login, createUser, addRoleToUser, getUserById };
