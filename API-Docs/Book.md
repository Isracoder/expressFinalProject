# API Documentation for the Book route

The api's in this doc are located in the "books" route , which is why every api call must start with that word.

The structure of a book object:

```javascript
book = {
  id: number,
  title: string,
  author: string,
  lanugage: string,
  pubYear: number,
  ISBN: string,
  ageRange: string,
};
```

Relations with other entities include : Genres , Libraries , Copies , Reviews , User (giveaway books) , User (wanted books)

## Current availble apis :

### To Create and add a book to the DB

```json
  - url : "/books"
  - method : POST
  - authentication : Yes
  - authorization : must have admin access
  - requirements :
    - book title : sent in req.body.title as a string
    - book author : sent in req.body.author as a string
    - book language: sent in req.body.language as a string
    - publication year: sent in req.body.pubYear
  - responses :
    - Status 201 , message : none , payload: the created book object
    - Status 400 , message : "Error creating book"
```

### To Get all available books

```json
  - url : "/books"
  - method : GET
  - authentication : No
  - authorization : No
  - requirements :
  - optional:
    - page number : in req.query.page as a query param , default 1
    - page size : in req.query.pageSize as a query param , default 10
  - responses :
    - Status 200 , message : paginated list of book objects
    - Status 500 , message : "Unable to retrieve books"
```

### Searching for a book by specific attributes

```json
- url : "/books/with"
- method : GET
- authentication : No
- authorization : No
- requirements : at least one of the optional query parameters
- optional :
    - language : sent in req.query.language
    - author : sent in req.query.author , (can be first name or last , no case sensitivity)
    - title : sent in req.query.title
    - pubYear: sent in req.query.year
- example : "/books/with?language=English & author=tolkien" returns all books where the language is english and the author name includes tolkien
- responses :
  - Status 200 , message : none , payload : the list of books that matched the query
  - Status 400 , message : "Error while searching for books"
```

### Searching for a book by id

```json
- url : "/books/id"
- method : GET
- authentication : No
- authorization : No
- requirements : id sent in req.body.id
- responses :
  - Status 200 , message : none , payload : the book with that id
  - Status 500 , message : "Error while retrieving book by id"
```

### Endpoints for book lists :

- ### Want list :

  - #### Adding a book to the user's want-list

    ```json
    - url : "/books/want"
    - method : PUT
    - authentication : Yes
    - authorization : No
    - requirements : book id sent in req.body.id
    - responses :
        - Status 200 , message : "Book added to want list successfully"
        - Status 500 , message : "Error while adding a book to your want-list"
    ```

  - #### Getting all books on the user's want-list

    ```json
    - url : "/books/want"
    - method : GET
    - authentication : Yes
    - authorization : No
    - requirements : none
    - responses :
        - Status 200 , message : none , payload : list of books on the want-list
        - Status 500 , message : "Error while retrieving your want-list"
    ```

  - #### Deleting a book from the user's want-list

    ```json
    - url : "/books/want"
    - method : Delete
    - authentication : Yes
    - authorization : No
    - requirements : book id sent in req.body.id
    - responses :
        - Status 200 , message : "Book removed from your want-list successfully"
        - Status 500 , message : "Error while removing a book from your want-list"
    ```

- ### Giveaway list :

  - #### Adding a book to the user's giveaway-list

    ```json
    - url : "/books/giveaway"
    - method : PUT
    - authentication : Yes
    - authorization : No
    - requirements : book id sent in req.body.id
    - responses :
        - Status 200 , message : "Book added to giveaway list successfully"
        - Status 500 , message : "Error while adding a book to your giveaway-list"
    ```

  - #### Getting all books on the user's giveaway-list

    ```json
    - url : "/books/giveaway"
    - method : GET
    - authentication : Yes
    - authorization : No
    - requirements : none
    - responses :
        - Status 200 , message : none , payload : list of books on the giveaway-list
        - Status 500 , message : "Error while retrieving your giveaway-list"
    ```

  - #### Deleting a book from the user's giveaway-list

    ```json
    - url : "/books/giveaway"
    - method : Delete
    - authentication : Yes
    - authorization : No
    - requirements : book id sent in req.body.id
    - responses :
        - Status 200 , message : "Book removed from your giveaway-list successfully"
        - Status 500 , message : "Error while removing a book from your giveaway-list"
    ```

### Using AWS rekognition to try to find book title in image

```json
- url : "/books/find/title"
- method : GET
- authentication : No
- authorization : No
- requirements : public Url image sent in req.body.img
- responses :
  - Status 200 , message : none , payload : list of strings that might be the title or part of it
  - Status 500 , message : "Error while getting title text from image"
```

### Uploading book cover image to AWS S3 bucket

```json
- url : "/books/image"
- method : GET
- authentication : Yes
- authorization : Yes , admin access
- requirements :
    - public url of the image in req.body.img
    - book id in req.body.id
- responses :
  - Status 200 , message : none , payload : the book of which the id was provided
  - Status 500 , message : "Error while trying to add book image to s3 bucket" ;
```
