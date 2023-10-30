# API Documentation for the Genre route

The api's in this doc are located in the "genres" route , which is why every api call must start with that word.

The structure of a genre object:

```javascript
genre = {
  id: number,
  name: string,
};
```

Relations with other entities include : Books

#### Possible error responses :

- Error code : 400 , reason for rejection
- Error code : 404 , "Invalid Request Path!"
- Error code : 500 , "Something went wrong :( " , this is the generic default
- Other custom codes with a message

# Current available apis :

## 1. Creating a genre 🎈

**Description** : This route creates a new genre and saves it in the database

### How to access the route ?

- **Url** : "/genres"
- **Method** : POST

### Security requirements

- **Authentication** : Yes
- **Authorization** : must have admin access

#### Request Body

| **property** | **type** | **description** | **required** |
| :----------: | :------: | :-------------: | :----------: |
|     name     |  string  | the genre name  |     Yes      |

#### Responses:

1. Status 201 created , with the created genre object

   ```json
   {
     "id": 4,
     "name": "Fantasy"
   }
   ```

1. Or an error response with a status code and message

## 2. To Get all available genres 🎈

### How to access the route ?

- **Url** : "/genres"
- **Method** : GET

### Security requirements

- **Authentication** : No
- **Authorization** : No

#### Query Params

| **property** | **type** |         **description**         | **required** | **Default** |
| :----------: | :------: | :-----------------------------: | :----------: | :---------: |
|     page     |  number  | the page you would like to view |      No      |      1      |
|   pageSize   |  number  | the number of items in the page |      No      |     10      |

#### Responses:

1. Status 200 ok , a list which contains the current page , the page size , the total number of objects in the db , and a list called "info" which contains the required object ;

   ```json
    [
    "page": 1,
    "pageSize": 2,
    "total": 16,
    "info": [
        {
          "id" : 1  ,
          "name": "History"
        } ,
        {
          "id" : 2  ,
          "name": "Adventure"
        }
      ]
    ]
   ```

1. Or an error response with a status code and message

## 3. Adding a genre to a book🎈

Adds a genre to the list of genres that describe a particular book

### How to access the route ?

- **Url** : "/genres/book"
- **Method** : PUT

### Security requirements

- **Authentication** : Yes
- **Authorization** : Yes , admin access

#### Request Body

The genre name is not case-sensitive

| **property** | **type** |    **description**    | **required** |
| :----------: | :------: | :-------------------: | :----------: |
|    genre     |  string  | the name of the genre |     Yes      |
|      id      |  number  |  the id of the book   |     Yes      |

#### Responses:

1. Status 200 ok , returns the book object that I sent the id of
1. An error message and status code

## 4. Searching for a genre by name 🎈

### How to access the route ?

- **Url** : "/genres/name"
- **Method** : GET

### Security requirements

- **Authentication** : No
- **Authorization** : No

#### Request Body

The name is not case-sensitive

| **property** | **type** |    **description**    | **required** |
| :----------: | :------: | :-------------------: | :----------: |
|     name     |  string  | the name of the genre |     Yes      |

#### Responses:

1. Status 200 ok , with the specific genre

1. Or an error message indicating that something went wrong , or that the genre with that name doesn't exist.
