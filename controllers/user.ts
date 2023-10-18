import { User } from "../db/entities/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
// import { Profile } from "../db/entities/Profile.js";
import datasource from "../db/index.js";
import dotenv from "dotenv";
import { Role, RoleType } from "../db/entities/Role.js";
import { getLibraryById } from "./library.js";
import { Librarian } from "../db/entities/Librarian.js";
import { getReviewsAndName } from "./reviews.js";
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
      const token = jwt.sign(
        {
          email: user.email,
          username: user.username,
          id: user.id,
        },
        process.env.SECRET_KEY || "",
        // secretKey || "",
        {
          expiresIn: "30m",
        }
      );

      return { token, userName: user.username, id: user.id };
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
  DOB: string,
  country: string,
  city: string,
  firstName?: string,
  lastName?: string
) => {
  try {
    const user = new User();
    // const profile = new Profile();
    user.username = userName;
    user.email = email;
    user.password = password;
    user.DOB = new Date(DOB);
    user.country = country;
    user.city = city;

    await user.save();
    // if i decide to create a separate profile entity
    // await datasource.manager.transaction(async (transactionManager) => {
    //   //   await transactionManager.save(profile);
    //   await transactionManager.save(user);
    // });
    console.log("after transaction manager");
    return user;
  } catch (error) {
    console.log(error);
    throw "something went wrong when creating a user";
  }
};
const getUserById = async (userId: number | string) => {
  if (typeof userId == "string") userId = parseInt(userId);
  if (!userId) throw "Not a valid input for the user id";
  const user = await User.findOneBy({ id: userId });
  if (user) return user;
  throw "User not found";
};

const addRoleToUser = async (
  roleName: Role["name"],
  id: string | number,
  libraryId?: string | number
) => {
  try {
    const role = await Role.findOneBy({ name: roleName });
    if (typeof id == "string") {
      id = parseInt(id);
    }
    const user = await User.findOne({
      where: { id: id },
      relations: ["roles"],
    });
    if (role && user) {
      console.log("user found and role found");
      try {
        // user.roles = [...user.roles, role];
        if (role.name == RoleType.librarian) {
          if (!libraryId) {
            throw "Send a library id to make this user a librarian of that library";
          }
          const library = await getLibraryById(libraryId);
          const librarian = new Librarian();
          librarian.library = library;
          librarian.userId = user.id;
          await librarian.save();
        }
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

const removeRoleFromUser = async (
  roleName: Role["name"],
  id: string | number,
  libraryId?: string | number
) => {
  try {
    const role = await Role.findOneBy({ name: roleName });
    if (typeof id == "string") {
      id = parseInt(id);
    }
    const user = await User.findOne({
      where: { id: id },
      relations: ["roles"],
    });
    if (role && user) {
      console.log("user found and role found");
      try {
        // user.roles = [...user.roles, role];
        if (role.name == RoleType.librarian) {
          // if (!libraryId)
          //   throw "Send a library id to make this user a librarian of";
          // const library = await getLibraryById(libraryId);
          // const librarian = new Librarian();
          // librarian.library = library;
          // librarian.userId = user.id;
          // await librarian.save();
        }
        user.roles = user.roles.filter((userRole) => userRole.id != role.id);
        await user.save();
        console.log("user Updated , role removed");
        return user;
      } catch (error) {
        console.log(error);
        throw error;
      }
    } else {
      throw "Not able to find role or user";
    }
  } catch (error) {
    throw error;
  }
};

const getRecsFromFriends = async (
  userFriends: User[],
  alreadyRead: Number[]
) => {
  const bookRecs: Object[] = [];
  for (let i = 0; i < userFriends.length; i++) {
    try {
      const friend = userFriends[i];
      const reviews = await getReviewsAndName(friend.id);

      console.log(reviews);
      reviews.forEach((review) => {
        if (review.stars >= 3.5 && !alreadyRead.includes(review.book.id)) {
          console.log("another book being recommended");
          let obj = {
            title: review.book.title,
            author: review.book.author,
            rating: review.stars,
            friend: friend.username,
          };
          bookRecs.push(obj);
        }
      });
      if (i + 1 == userFriends.length) return bookRecs;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
};

export {
  login,
  createUser,
  addRoleToUser,
  getUserById,
  removeRoleFromUser,
  getRecsFromFriends,
};
