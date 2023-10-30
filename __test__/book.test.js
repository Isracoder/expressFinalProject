import dataSource, { initialize } from '../dist/db/index.js';
import "../jest.config.js" ;
import dotenv from "dotenv";
dotenv.config() ;
import supertest from "supertest" 

// import copyRouter from "../routes/copies.js"
import express from "express";
// const app = express();
// app.use(express.json());
// import bookRouter from "../routes/books.js"
// app.use("/books", bookRouter);
// app.use("/copies", copyRouter);
// app.use(express.urlencoded({ extended: false }));


// beforeAll(async () => {
//   await initialize();
// });

// might need to revert to previous changes

beforeAll(async () => {

    console.log("Am listening");
    await dataSource.initialize().then(() => {
        console.log('DB connected');
    }).catch(err => {
        console.log("DB connection failed", err);
    });
  
  
}, 30000);

afterAll(async () => {
  await dataSource.destroy();
});

const request = supertest('http://localhost:3000') ;
// const request = supertest(app) ;
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


