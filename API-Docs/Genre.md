# API Documentation for the Genre route

The api's in this doc are located in the "genres" route , which is why every api call must start with that word.

## Current availble apis :

### To Create and add a Genre to the DB

```json
  - url : "/genres"
  - method : POST
  - authentication : Yes
  - authorization : must have admin access
  - requirements :
    - genre name : sent in req.body.name as a string
  - responses :
    - Status 201 , message : , payload: the created genre object with {id: number , name: string }
    - Status 400 , message : "Unable to create Genre"
```

### To Get all available genres

```json
  - url : "/genres"
  - method : GET
  - authentication : No
  - authorization : No
  - requirements :
  - optional:
    - page number : in req.query.page as a query param , default 1
    - page size : in req.query.pageSize as a query param , default 10
  - responses :
    - Status 200 , message : paginated list of genre objects with {id: , name:}
    - Status 500 , message : "Unable to retrieve Genres"
```

### Adding a genre to a specific book

```json
- url : "/genres/book"
- method : PUT
- authentication : Yes
- authorization : must have admin access
- requirements :
  - genre name : sent in req.body.name
  - book id: sent in req.body.id
- responses :
  - Status 200 , message : "Genre added to book successfully"
  - Status 400 , message : "Unable to create Genre"
```
