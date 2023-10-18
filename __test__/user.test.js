import dataSource, { initialize } from '../dist/db/index.js';
// import {User} from "../dist/db/entities/User.js";
import "../jest.config.json" ;
import dotenv from "dotenv";
dotenv.config() ;
import jest from "jest" ;
import { login, createUser, addRoleToUser } from "../dist/controllers/user.js";
import jwt from "jsonwebtoken";
// import { Role } from "../dist/db/entities/Role.js";


beforeAll(async () => {
  await initialize();
});

afterAll(async () => {
  await dataSource.destroy();
});

const adminData = {
  "username": "israAdmin",
  "email" : "israAdmin@gmail.com",
  "password": "secretAdmin" ,
};

describe("Login process", () => {
  let data;
  // const secretKey = "kdfjkdjfkd";
  beforeAll(async () => {
    data = await login(adminData.email, adminData.password);
    // token = "jdjf" ;
    console.log(`token ${data}`);
  });

  it("returns a token", async () => {
    expect(data.token).toBeTruthy();
  });

  it("has a valid token", () => {
    const tokenIsValid = jwt.verify(data.token, process.env.SECRET_KEY || "");
    expect(tokenIsValid).toBeTruthy();
  });

  it("has valid payload", () => {
    const payload = jwt.decode(data.token, { json: true });
    expect(payload?.email).toEqual(adminData.email);
  });
});
const userData = {
    userName: "testUser2",
    password: "1234567",
    email: "test2@gmail.com",dateOfBirth: new Date("10/1/2000"),
    country:"Palestine" , city:"Bethlehem"
  };
describe("Creating a user", () => {
  
  
  let res;
  beforeAll(async () => {
    res = await createUser(
      userData.userName,
      userData.password,
      userData.email,
      userData.dateOfBirth, userData.country , userData.city
    );
  });

  it("Creates a user correctly", () => {
    // console.log(`Date of birth ${userData.dateOfBirth}`) ;
    // console.log(`res ${res}`);
    expect(res).toBeTruthy();
  });

});

describe("Assigning a role to a user", () => {
  const roleData = {
    roleName: "admin",
    userId: "2",
  };

  let res ;
  beforeAll(async () => {
    res = await addRoleToUser(roleData.roleName , roleData.userId) ;
  });
  
  it("finds user and role then adds role to user successfully", () => {
    console.log("in final one");
    expect(res).toBeTruthy() ;
  });
});
