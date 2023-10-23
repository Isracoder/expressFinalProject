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

# Current available apis :

## 1. Creating a book 🎈
  **Description** : This route creates a new book and saves it in the database    
  
  ### How to access the route ?
     - **Url** : "/books"
     - **Method** : POST
  ### Security requirements
   - **Authentication** : Yes   
   - **Authorization** : must have admin access
   
  #### Request Body 
  | **property** | **type** |              **description**              | **required** |
  |:------------:|:--------:|:-----------------------------------------:|:------------:|
  |     title    |  string  |               the book title              |      Yes     |
  |    author    |  string  |              the book author              |      Yes     |
  |    pubYear   |  number  |            the publication year           |      Yes     |
  |   language   |  string  | the original language it was published in |      Yes     |
  
  #### Responses:
    - Status 201 created  , with the created book object
  ```json
    {
      "id" : 4 ,
      "title" : "Tired and bored" , 
      "author" : "isra" ,
      "language": "English"
    }
  ```
  
  ##### Error responses :
    - Status 400 , Error creating book
    - Status 500 , Something went wrong


## 2. To Get all available books 🎈


### How to access the route ?
   - **Url** : "/books"
   - **Method** : GET
### Security requirements
 - **Authentication** : No
 - **Authorization** : No
 
#### Query Params

| **property** | **type** |         **description**         | **required** | **Default** |
|:------------:|:--------:|:-------------------------------:|:------------:|:-----------:|
|     page     |  number  | the page you would like to view |      No      |      1      |
|   pageSize   |  number  | the number of items in the page |      No      |      10     |

#### Responses:
  - Status 200 ok , with the list of books
```json
[
  {
    "id" : 4 ,
    "title" : "Tired and bored" , 
    "author" : "isra" ,
    "language": "English"
  } ,
 {
    "id" : 5 ,
    "title" : "Energized and content" , 
    "author" : "not isra" ,
    "language": "Arabic"
  } ,
]
```

##### Error responses :
  - Status 400 , Error getting books
  - Status 500 , Something went wrong


## 3. Searching for a book by specific attributes 🎈

### How to access the route ?
   - **Url** : "/books/with"
   - **Method** : GET
### Security requirements
 - **Authentication** : No
 - **Authorization** : No
 
#### Query Params

The query params such as title or author are not case-sensitive     

| **property** | **type** |              **description**             | **required** |
|:------------:|:--------:|:----------------------------------------:|:------------:|
|   language   |  string  |      the page you would like to view     |      No      |
|     title    |  string  |     the book title or a word from it     |      No      |
|     year     |  number  |           the publication year           |      No      |
|    author    |  string  | the author's first, last, or middle name |      No      |

#### Responses:
  - Status 200 ok , with the list of books
```json
[
  {
    "id" : 4 ,
    "title" : "Tired and bored" , 
    "author" : "isra" ,
    "language": "English"
  } ,
 {
    "id" : 5 ,
    "title" : "Energized and content" , 
    "author" : "not isra" ,
    "language": "Arabic"
  } ,
]
```

##### Error responses :
  - Status 400 , Error getting books
  - Status 500 , Something went wrong

## 4. Searching for a book by id 🎈


### How to access the route ?
   - **Url** : "/books/id"
   - **Method** : GET
### Security requirements
 - **Authentication** : No
 - **Authorization** : No

 #### Request Body 
| **property** | **type** |              **description**              | **required** |
|:------------:|:--------:|:-----------------------------------------:|:------------:|
|     id       |  number  |               the book id                 |      Yes     |

#### Responses:
  - Status 200 ok , with the specific book
    
```json
 {
    "id" : 5 ,
    "title" : "Energized and content" , 
    "author" : "not isra" ,
    "language": "Arabic"
  } 
```
Or an error message indicating that something went wrong , or that the book with that id doesn't exist.



## Endpoints for book lists :

- ## Want list 🛒 :

  - ### Adding a book to the user's want-list 🎈
  
    ### How to access the route ?
       - **Url** : "/books/want"
       - **Method** : PUT
    ### Security requirements
     - **Authentication** : Yes
     - **Authorization** : No
    
     #### Request Body 
    | **property** | **type** |              **description**              | **required** |
    |:------------:|:--------:|:-----------------------------------------:|:------------:|
    |     id       |  number  |               the book id                 |      Yes     |
    
    #### Responses:
    Status 200 ok , `"book added to want list successfully"`

    Or an error message indicating that something went wrong , or that the book with that id doesn't exist.


  - ### Getting all books on the user's want-list 🎈
    
    ### How to access the route ?
       - **Url** : "/books/want"
       - **Method** : GET
    ### Security requirements
     - **Authentication** : Yes
     - **Authorization** : No
    
    #### Responses:
    Status 200 ok , a list of all book objects on the want-list 

    Or an error message indicating that something went wrong 


  - ### Deleting a book from the user's want-list 🎈
    
    ### How to access the route ?
       - **Url** : "/books/want"
       - **Method** : DELETE
    ### Security requirements
     - **Authentication** : Yes
     - **Authorization** : No
    
     #### Request Body 
    | **property** | **type** |              **description**              | **required** |
    |:------------:|:--------:|:-----------------------------------------:|:------------:|
    |     id       |  number  |               the book id                 |      Yes     |
    
    #### Responses:
    Status 200 ok , `"book removed from your want-list successfully"`

    Or an error message indicating that something went wrong , or that the book with that id doesn't exist.

- ## Giveaway list 🎁 :

  - ### Adding a book to the user's giveaway-list 🎈
  
    ### How to access the route ?
       - **Url** : "/books/giveaway"
       - **Method** : PUT
    ### Security requirements
     - **Authentication** : Yes
     - **Authorization** : No
    
     #### Request Body 
    | **property** | **type** |              **description**              | **required** |
    |:------------:|:--------:|:-----------------------------------------:|:------------:|
    |     id       |  number  |               the book id                 |      Yes     |
    
    #### Responses:
    Status 200 ok , `"book added to  giveaway-list successfully"`

    Or an error message indicating that something went wrong , or that the book with that id doesn't exist.

  - ### Getting all books on the user's giveaway-list 🎈

   
    ### How to access the route ?
       - **Url** : "/books/giveaway"
       - **Method** : GET
    ### Security requirements
     - **Authentication** : Yes
     - **Authorization** : No
    
    #### Responses:
    Status 200 ok , a list of all book objects on the giveaway-list 

    Or an error message indicating that something went wrong 


  - ### Deleting a book from the user's giveaway-list 🎈
    
    ### How to access the route ?
       - **Url** : "/books/giveaway"
       - **Method** : DELETE
    ### Security requirements
     - **Authentication** : Yes
     - **Authorization** : No
    
     #### Request Body 
    | **property** | **type** |              **description**              | **required** |
    |:------------:|:--------:|:-----------------------------------------:|:------------:|
    |     id       |  number  |               the book id                 |      Yes     |
    
    #### Responses:
    Status 200 ok , `"book removed from your giveaway-list successfully"`

    Or an error message indicating that something went wrong , or that the book with that id doesn't exist.

### Using AWS rekognition 👓 to try to find book title in image 🎈


  ### How to access the route ?
   - **Url** : "/books/find/title"
   - **Method** : GET
  ### Security requirements
   - **Authentication** : No
   - **Authorization** : No
  
   #### Request Body 
  | **property** | **type** |              **description**              | **required** |
  |:------------:|:--------:|:-----------------------------------------:|:------------:|
  |     img      |  string  |       the public url of the image         |      Yes     |
  
  #### Responses:
  Status 200 ok , list of strings that might be the title or part of it
  ```json
[ "This is in" , "the title" , "random" , "words"]
  ```

  Or an error message indicating that something went wrong with a relevant status code
    

### Uploading book cover image to AWS S3 bucket

 ### How to access the route ?
   - **Url** : "/books/image"
   - **Method** : PUT
  ### Security requirements
   - **Authentication** : Yes
   - **Authorization** : Yes , admin access
  
   #### Request Body 
  | **property** | **type** |              **description**              | **required** |
  |:------------:|:--------:|:-----------------------------------------:|:------------:|
  |     img      |  string  |       the public url of the image         |      Yes     |
  |     id       |  number  |             the book id                   |      Yes     |  
  
  #### Responses:
  Status 200 ok , returns the book of which the id was provided     
  Or a relevant error message with status code
