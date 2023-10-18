import dataSource, { initialize } from '../dist/db/index.js';
// import User from "../dist/db/entities/User.js";

// import sinon from "sinon"
// import { authenticate } from '../dist/middlewares/auth/authenticate.js';

// const adminStub = sinon.stub(auth).callsFake((req, res, next) => next());
import "../jest.config.json" ;
import dotenv from "dotenv";
import express from "express" ;
dotenv.config() ;
import supertest from "supertest" ;
import * as app from "../dist/index.js"

const request = supertest('http://localhost:3000') ;
// supertest.agent()
// supertest()

beforeAll(async () => {
  await initialize();
});

afterAll(async () => {
  await dataSource.destroy();
});


describe("getting books", () => {
    
    it("gets books by id",  async()=> {
        // Sends GET Request to /users/giveaway endpoint
        const res1 = await request.get("/books/id").send({
            id : "7" 
        });
        expect(res1.status).toBe(200) ;
        // done();
      });
      
      it("gets all books", async () => {
        // Sends GET Request to /users/giveaway endpoint
        const response = (await request.get("/books"))
        expect(response.status).toBe(200) ;
        // done();
      });
      


    it("gets copies of a specific book", async() => {
        // Sends GET Request to /users/giveaway endpoint
        const res3 = await request.get("/copies/book").send({
            bookId: 2
        });
        expect(res3.status).toBe(200) ;
        
      });
      
});


