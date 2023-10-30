# API Documentation for the Permission route

The api's in this doc are located in the "permissions" route , which is why every api call must start with that word.

The structure of a permission object:

```javascript
permission = {
    id: number,
    name: PermissionName ,
};
enum PermissionName {
  addBook = "addBook",
  deleteBook = "deleteBook",
  librarianAccess = "librarianAccess",
  adminAccess = "adminAccess",
}
```

Relations with other entities include : Roles

#### Possible error responses :

- Error code : 400 , reason for rejection
- Error code : 404 , "Invalid Request Path!"
- Error code : 500 , "Something went wrong :( " , this is the generic default
- Other custom codes with a message

# Current available apis :

## 1. Creating a permission 🎈

**Description** : This route creates a new permission and saves it in the database

### How to access the route ?

- **Url** : "/permissions"
- **Method** : POST

### Security requirements

- **Authentication** : Yes
- **Authorization** : Yes , admin access

#### Request Body

| **property** |    **type**    |      **description**       | **required** |
| :----------: | :------------: | :------------------------: | :----------: |
|     name     | PermissionName | the name of the permission |     Yes      |

#### Responses:

1. Status 201 created , with the created permission object

   ```json
   {
     "id": 4,
     "name": "adminAccess"
   }
   ```

1. Or an error response with a status code and message

## 2. To Get all available permissions 🎈

### How to access the route ?

- **Url** : "/permissions"
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
          "id" : 1  ,
          "name": "librarianAccess"
        } ,
        {
          "id" : 2  ,
          "name": "addBook"
        }
      ]
    ]
   ```

1. Or an error response with a status code and message

## 3. Adding a permission to a role🎈

Adds a permission to the list of permissions connected to a specific role

### How to access the route ?

- **Url** : "/permissions/role"
- **Method** : PUT

### Security requirements

- **Authentication** : Yes
- **Authorization** : Yes , admin access

#### Request Body

| **property** | **type** |      **description**       | **required** |
| :----------: | :------: | :------------------------: | :----------: |
|  permission  |  string  | the name of the permission |     Yes      |
|   roleName   |  string  |  the name of a valid role  |     Yes      |

#### Responses:

1. Status 200 ok , returns the role object that I sent the name of
1. An error message and status code
