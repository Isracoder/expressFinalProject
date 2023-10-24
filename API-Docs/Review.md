# API Documentation for the Review route

The api's in this doc are located in the "reviews" route , which is why every api call must start with that word.

The structure of a review object:

```javascript
review = {
  id: number,
  text: string,
  createdAt: Date,
  stars: number,
};
```

The stars property may be a decimal

Relations with other entities include : Books , User

# Current available apis :

## 1. Creating a review 🎈

**Description** : This route creates a new review and saves it in the database

### How to access the route ?

- **Url** : "/reviews"
- **Method** : POST

### Security requirements

- **Authentication** : Yes
- **Authorization** : No

#### Request Body

| **property** |   **type**    |       **description**       | **required** |
| :----------: | :-----------: | :-------------------------: | :----------: |
|    bookId    |    number     | the id of the relevant book |     Yes      |
|     text     |    string     |       the review text       |     Yes      |
|    stars     | int or double |  the stars for the review   |     Yes      |

#### Responses:

1. Status 201 created , with the created review object

   ```json
   {
     "id": 4,
     "text": "Great book , would not reccommend",
     "stars": "4.25",
     "createdAt": "2023-10-16T19:15:11.000Z" ,
     "book" : {
        "id" : 4 , ....
     }
   }
   ```

1. Or an error response with a status code and message

## 2. To Get all available reviews 🎈

### How to access the route ?

- **Url** : "/reviews"
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
    "total": 4,
    "info": [
        {
            "id": 4,
            "text": "Great book , would not reccommend",
            "stars": "4.25",
            "createdAt": "2023-10-16T19:15:11.000Z" ,
            "book" : {
                "id" : 4 , ....
            }
        } ,
        {
            "id": 5,
            "text": "Horrible book ,might reccommend",
            "stars": "2.5",
            "createdAt": "2023-10-14T19:15:11.000Z" ,
            "book" : {
                "id" : 6 , ....
            }
        } ,
      ]
    ]
   ```

1. Or an error response with a status code and message

## 3. Getting all reviews of a specific user🎈

### How to access the route ?

- **Url** : "/reviews/user"
- **Method** : GET

### Security requirements

- **Authentication** : No
- **Authorization** : No

#### Request Body

| **property** | **type** |                 **description**                  | **required** |
| :----------: | :------: | :----------------------------------------------: | :----------: |
|      id      |  number  | the id of the user whose reviews you want to get |     Yes      |

#### Query Params

| **property** | **type** |         **description**         | **required** | **Default** |
| :----------: | :------: | :-----------------------------: | :----------: | :---------: |
|     page     |  number  | the page you would like to view |      No      |      1      |
|   pageSize   |  number  | the number of items in the page |      No      |     10      |

#### Responses:

1. Status 200 ok , and a paginated list similar to the one in the api above with multiple reviews. Here the reviews in the result all belong to a specific user

1. Or an error response with a status code and message

## 4. Getting all reviews of a for a specific book 🎈

### How to access the route ?

- **Url** : "/reviews/book"
- **Method** : GET

### Security requirements

- **Authentication** : No
- **Authorization** : No

#### Request Body

| **property** | **type** |                 **description**                  | **required** |
| :----------: | :------: | :----------------------------------------------: | :----------: |
|      id      |  number  | the id of the book whose reviews you want to get |     Yes      |

#### Query Params

| **property** | **type** |         **description**         | **required** | **Default** |
| :----------: | :------: | :-----------------------------: | :----------: | :---------: |
|     page     |  number  | the page you would like to view |      No      |      1      |
|   pageSize   |  number  | the number of items in the page |      No      |     10      |

#### Responses:

1. Status 200 ok , and a paginated list containing multiple reviews. Here the reviews in the result are all for a certain book

1. Or an error response with a status code and message

## 4. Changing the star count of a specific review 🎈

#### You cannot change a review that isn't yours as the logged in user

### How to access the route ?

- **Url** : "/reviews/book/stars"
- **Method** : PUT

### Security requirements

- **Authentication** : Yes
- **Authorization** : No

#### Request Body

| **property** | **type** |                        **description**                        | **required** |
| :----------: | :------: | :-----------------------------------------------------------: | :----------: |
|    bookId    |  number  | the id of the book of which you want to change your review of |     Yes      |
|    stars     |  number  |                      the new star count                       |     Yes      |

#### Responses:

1. Status 200 ok , with a message "User review updated successfully"

1. Or an error response with a status code and message

## 5. Changing the text of a specific review 🎈

#### You cannot change a review that isn't yours as the logged in user

### How to access the route ?

- **Url** : "/reviews/book/text"
- **Method** : PUT

### Security requirements

- **Authentication** : Yes
- **Authorization** : No

#### Request Body

| **property** | **type** |                        **description**                        | **required** |
| :----------: | :------: | :-----------------------------------------------------------: | :----------: |
|    bookId    |  number  | the id of the book of which you want to change your review of |     Yes      |
|     text     |  string  |                  the new text for the review                  |     Yes      |

#### Responses:

1. Status 200 ok , with a message "Review updated successfully"

1. Or an error response with a status code and message
