# API Documentation for the Library route

The api's in this doc are located in the "libraries" route , which is why every api call must start with that word.

The structure of a library object:

```javascript
library = {
  id: number,
  name: string,
  type: LibraryType,
  country: string,
  city: number,
};

enum LibraryType {
  bookstore = "bookstore",
  public = "public",
  private = "private",
  school = "school",
  university = "university",
}

```

Relations with other entities include : Librarians , Copies , Users

#### Possible error responses :

- Error code : 400 , reason for rejection
- Error code : 404 , "Invalid Request Path!"
- Error code : 500 , "Something went wrong :( " , this is the generic default
- Other custom codes with a message

# Current available apis :

## 1. Creating a library 🎈

**Description** : This route creates a new library and saves it in the database

### How to access the route ?

     - **Url** : "/libraries"
     - **Method** : POST

### Security requirements

- **Authentication** : Yes
- **Authorization** : must have admin access

#### Request Body

| **property** | **type** |      **description**       | **required** |
| :----------: | :------: | :------------------------: | :----------: |
|     name     |  string  |      the library name      |     Yes      |
|     type     |  string  |      the library type      |     Yes      |
|   country    |  string  | the country of the library |     Yes      |
|     city     |  string  |  the city of the library   |     Yes      |

#### Responses:

1. Status 201 created , with the created library object

   ```json
   {
     "id": 4,
     "name": "Hebron public library",
     "type": "public",
     "country": "Palestine",
     "city": "Hebron"
   }
   ```

1. Or an error response with a status code and message

## 2. To Get all available libraries 🎈

### How to access the route ?

- **Url** : "/libraries"
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

1. Status 200 ok , a list which contains the current page , the page size , the total number of objects in the db , and a list called "info" which contains the objects

   ```json
   [
    "page": 1 ,
    "pageSize" : 2 ,
    "total" : 8 ,
    "info": [
        {
            "id": 4,
            "name": "Hebron public library",
            "type": "public",
            "country": "Palestine",
            "city": "Hebron"
        },
        {
            "id": 5,
            "name": "Bethlehem public library",
            "type": "public",
            "country": "Palestine",
            "city": "Bethlehem"
        }
    ]
   ]
   ```

1. Or an error response with a status code and message

## 3. Searching for a library by Location 🎈

Get all libraries in a specific country , city or both depending on what was sent.

### How to access the route ?

- **Url** : "/libraries/in"
- **Method** : GET

### Security requirements

- **Authentication** : No
- **Authorization** : No

#### Query Params

It's important to note while both aren't required **at least one** of them is .

| **property** | **type** |      **description**       | **required** |
| :----------: | :------: | :------------------------: | :----------: |
|   country    |  string  | the country of the library |      No      |
|     city     |  string  |  the city of the library   |      No      |

#### Responses:

1. Status 200 ok , with the list of libraries (which may be empty)

2. Or an error response with a status code and reason.

## 4. Searching for a library by id 🎈

### How to access the route ?

- **Url** : "/libraries/id"
- **Method** : GET

### Security requirements

- **Authentication** : No
- **Authorization** : No

#### Request Body

| **property** | **type** | **description** | **required** |
| :----------: | :------: | :-------------: | :----------: |
|      id      |  number  | the library id  |     Yes      |

#### Responses:

1. Status 200 ok , with the specific library

1. Or an error message indicating that something went wrong , or that the library with that id doesn't exist.

## 5. Searching for copies of books in a specific library🎈

This route gets all copies of books in a specific library that match the criteria sent in the query params.

### How to access the route ?

- **Url** : "/libraries/id/books"
- **Method** : GET

### Security requirements

- **Authentication** : No
- **Authorization** : No

#### Request Body

| **property** | **type** | **description** | **required** |
| :----------: | :------: | :-------------: | :----------: |
|      id      |  number  | the library id  |     Yes      |

#### Query Params

| **property** | **type** |             **description**              | **required** |
| :----------: | :------: | :--------------------------------------: | :----------: |
|   language   |  string  |    the original language of the book     |      No      |
|    title     |  string  |     the book title or a word from it     |      No      |
|     year     |  number  |           the publication year           |      No      |
|    author    |  string  | the author's first, last, or middle name |      No      |

#### Responses:

1. Status code 200 , with the list of copies that match the criteria (may be empty) ;

```json
[
    {
        "id": 2 ,
        "book" : {
            ...
        } ,
        "library": {

        }  ,
        "status" : "available"
    },
    {
        "id": 3 ,
        "book" : {
            ...
        } ,
        "library": {

        }  ,
        "status" : "unavailable"
    }
]
```

1. Or an error message with a status code and response
