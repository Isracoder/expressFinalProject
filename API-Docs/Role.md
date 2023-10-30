# API Documentation for the Role route

The api's in this doc are located in the "roles" route , which is why every api call must start with that word.

The structure of a role object:

```javascript
role = {
    id: number,
    name: RoleType ,

};
 enum RoleType {
  user = "user",
  admin = "admin",
  librarian = "librarian",
}
```

Relations with other entities include : Users , Permissions

#### Possible error responses :

- Error code : 400 , reason for rejection
- Error code : 404 , "Invalid Request Path!"
- Error code : 500 , "Something went wrong :( " , this is the generic default
- Other custom codes with a message

# Current available apis :

## 1. Creating a role 🎈

**Description** : This route creates a new role and saves it in the database

### How to access the route ?

- **Url** : "/roles"
- **Method** : POST

### Security requirements

- **Authentication** : Yes
- **Authorization** : Yes , admin access

#### Request Body

| **property** | **type** |   **description**    | **required** |
| :----------: | :------: | :------------------: | :----------: |
|     name     | RoleName | the name of the role |     Yes      |

#### Responses:

1. Status 201 created , with the created role object

   ```json
   {
     "id": 4,
     "name": "admin"
   }
   ```

1. Or an error response with a status code and message

## 2. To Get all available roles 🎈

### How to access the route ?

- **Url** : "/roles"
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
          "name": "admin"
        } ,
        {
          "id" : 2  ,
          "name": "librarian"
        }
      ]
    ]
   ```

1. Or an error response with a status code and message

## 3. Getting all permissions of a specific role🎈

### How to access the route ?

- **Url** : "/roles/permissions"
- **Method** : GET

### Security requirements

- **Authentication** : No
- **Authorization** : No

#### Request Body

| **property** | **type** |                   **description**                   | **required** |
| :----------: | :------: | :-------------------------------------------------: | :----------: |
|     name     |  string  | the name of the role you want to see permissions of |     Yes      |

#### Responses:

1. Status 200 ok , and a list which contains all permissions of that particular role

   ```json
   [
     {
       "id": 1,
       "name": "adminAccess"
     },
     {
       "id": 2,
       "name": "addBook"
     }
   ]
   ```

## 4. Assigning a role to a user🎈

Adds a role to the list of roles connected to a specific user

### How to access the route ?

- **Url** : "/roles/user"
- **Method** : PUT

### Security requirements

- **Authentication** : Yes
- **Authorization** : Yes , admin access

#### Request Body

#### While the libraryId isn't usually required , it is needed when you want to add the role of a librarian to a user. This specifies which library they have access to.

| **property** | **type** |                 **description**                 | **required** |
| :----------: | :------: | :---------------------------------------------: | :----------: |
|      id      |  number  |               the id of the user                |     Yes      |
|   roleName   |  string  |            the name of a valid role             |     Yes      |
|  libraryId   |  number  | the library id if the added role is a librarian |      No      |

#### Responses:

1. Status 200 ok , returns the user object that I sent the id of
1. An error message and status code

## 5. Removing a role from a user🎈

Adds a role to the list of roles connected to a specific user

### How to access the route ?

- **Url** : "/roles/user"
- **Method** : DELETE

### Security requirements

- **Authentication** : Yes
- **Authorization** : Yes , admin access

#### Request Body

#### While the libraryId isn't usually required , it is needed when you want to remove the role of a librarian from a user. This removes their access from a specific library.

| **property** | **type** |                 **description**                  | **required** |
| :----------: | :------: | :----------------------------------------------: | :----------: |
|      id      |  number  |                the id of the user                |     Yes      |
|   roleName   |  string  |             the name of a valid role             |     Yes      |
|  libraryId   |  number  | the library id if the delted role is a librarian |      No      |

#### Responses:

1. Status 200 ok , returns the user object that I sent the id of
1. An error message and status code
