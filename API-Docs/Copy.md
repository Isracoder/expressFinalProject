# API Documentation for the Copy route

The api's in this doc are located in the "copies" route , which is why every api call must start with that word.

The structure of a copy object:

```javascript
copy = {
    id: number,
    book: Book Entity ,
    library: Library Entity ,
    status : copyStatus
};

enum copyStatus {
  available = "available",
  unavailable = "unavailable",
}
```

Relations with other entities include : Books

# Current available apis :

## 1. Creating a copy 🎈

**Description** : This route creates a new copy and saves it in the database

### How to access the route ?

- **Url** : "/copies"
- **Method** : POST

### Security requirements

- **Authentication** : Yes
- **Authorization** : must have librarian access (and you must be a librarian of that specific library)

#### Request Body

| **property** | **type** |                  **description**                   | **required** |
| :----------: | :------: | :------------------------------------------------: | :----------: |
|    bookId    |  number  |                 the id of the book                 |     Yes      |
|    libId     |  number  | the id of the library of which you are a librarian |     Yes      |

#### Responses:

1. Status 201 created , with the created copy object

   ```json
        {
          "id": 1,
            "status": "unavailable",
            "book": {
                "id": 1, ...
            },
            "library": {
                "id": 1, ...
            }
        },
   ```

1. Or an error response with a status code and message

## 2. To Get all available copies 🎈

### How to access the route ?

- **Url** : "/copies"
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
          "id": 1,
            "status": "unavailable",
            "book": {
                "id": 1, ...
            },
            "library": {
                "id": 1, ...
            }
        },
        {
          "id": 2,
            "status": "available",
            "book": {
                "id": 1, ...
            },
            "library": {
                "id": 1, ...
            }
        },
      ]
    ]
   ```

1. Or an error response with a status code and message

## 3. Getting all copies of a specific book🎈

### How to access the route ?

- **Url** : "/copies/book"
- **Method** : GET

### Security requirements

- **Authentication** : No
- **Authorization** : No

#### Request Body

The copy name is not case-sensitive

| **property** | **type** |  **description**   | **required** |
| :----------: | :------: | :----------------: | :----------: |
|      id      |  number  | the id of the book |     Yes      |

#### Responses:

1. Status 200 ok , returns the list of copies of that specific book (might be empty)
1. An error message and status code

## 4. Changing the status of a copy 🎈

### How to access the route ?

- **Url** : "/copies/status"
- **Method** : PUT

### Security requirements

- **Authentication** : Yes
- **Authorization** : Yes , librarian access

#### Request Body

The name is not case-sensitive

| **property** |  **type**  |                          **description**                          | **required** |
| :----------: | :--------: | :---------------------------------------------------------------: | :----------: |
|    status    | copyStatus |                    the new status of the copy                     |     Yes      |
|    copyId    |   number   |                    the id of the specific copy                    |     Yes      |
|    libId     |   number   | the library id that has this copy and that you are a librarian of |     Yes      |

#### Responses:

1. Status 200 ok , with the message "Copy status changed successfully to (new status)"

1. An error message indicating that something went wrong with the appropriate status code
