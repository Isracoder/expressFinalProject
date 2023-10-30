import dataSource, { initialize } from '../dist/db/index.js';
// import {User} from "../dist/db/entities/User.js";
import "../jest.config.js" ;
import dotenv from "dotenv";
dotenv.config() ;
import { login, createUser, addRoleToUser, getUserById , getUserIdByName } from "../dist/controllers/user.js";
import jwt from "jsonwebtoken";



// beforeAll(async () => {
//   await initialize();
// });
beforeAll(async () => {
  await dataSource.initialize().then(() => {
        console.log('DB connected');
    }).catch(err => {
        console.log("DB connection failed", err);
    });
}, 30000);

afterAll(async () => {
  await dataSource.destroy();
  
});

const userData = {
  userName: "testUser7",
  password: "1234567",
  email: "test7@gmail.com",dateOfBirth: new Date("10/1/2000"),
  country:"Palestine" , city:"Gaza"
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

describe("Login process", () => {
  let data;
  // const secretKey = "kdfjkdjfkd";
  beforeAll(async () => {
    data = await login(userData.email, userData.password);
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
    expect(payload?.email).toEqual(userData.email);
  });
});


describe("Assigning a role to a user", () => {
  const roleData = {
    roleName: "admin",
    userName: userData.userName
  };

  let res ;
  beforeAll(async () => {
    // const role = new Role() ;
    // role.name = roleData.roleName ;
    // await role.save() ;
    let id = await getUserIdByName(roleData.userName) ;
    res = await addRoleToUser(roleData.roleName , id) ;
  });
  
  it("finds user and role then adds role to user successfully", () => {
    console.log("in final one");
    expect(res).toBeTruthy() ;
  });
});
