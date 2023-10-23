# API Documentation for the User route

The api's in this doc are located in the "users" route , which is why every api call must start with that word.

The structure of a user object:

```javascript
user = {
  id: number,
  username: string,
  password: string,
  email: string,
  DOB: Date,
  country: string,
  city: string,
};
```

Relations with other entities include :

## Current availble apis :

### To Create and add a user to the DB

```json
    - url : "/users"
    - method : POST
    - authentication : Yes
    - authorization : must have admin access
    - requirements :
        - name : sent in req.body.username
        - password : sent in req.body.password
        - email: sent in req.body.email
        - date of birth : sent in req.body.DOB , yyyy/mm/dd
    - optional :
        - country : sent in req.body.country
        - city : sent in req.body.city
    - responses :
    - Status 201 , message : none , payload: the created user object
    - Status 400 , message : "Error creating user"
```

### To Get all available users

```json
  - url : "/users"
  - method : GET
  - authentication : No
  - authorization : No
  - requirements :
  - optional:
    - page number : in req.query.page as a query param , default 1
    - page size : in req.query.pageSize as a query param , default 10
  - responses :
    - Status 200 , message : paginated list of user objects
    - Status 500 , message : "Unable to retrieve users"
```

### Logging in a user (and stores cookie) for future authentication

```json
- url : "/users/login"
- method : POST
- authentication : No
- authorization : No
- requirements :
    - email : send in req.body.email
    - password : send in req.body.password
- responses :
  - Status 200 , message : none , payload :  data object containing the jwt token
  - Status 401 , message : describes error in login process
```

### Logging out a user (deletes the cookie from the users side)

```json
- url : "/users/logout"
- method : GET
- authentication : Yes
- authorization : No
- requirements : none
- responses :
  - Status 200 , message : "logged out"

```

### Sending emails to users

```json
- url : "/users/send-email"
- method : POST
- authentication : Yes
- authorization : Yes , admin access
- requirements :
    - recipient : email address of a recipient or list of addresses , send in req.body.recipient
    - subject : the email subject  , send in req.body.subject
    - message: the email message , send in req.body.message
- responses :
  - Status 200 , message : "Email sent successfully"
  - Status 500 , message : "Error while sending email"
```

### Renders a view in the browser of a chart representing genres of books read

```json
- url : "/users/data"
- method : GET
- authentication : Yes
- authorization : No
- requirements :
- responses :
  - Status 200 , payload : renders a chart in the browser using chart.js
  - Status 500 , message : "Error while rendering chart data"
```

### Endpoints for user lists :

- ### Want list :

  - #### Adding a user to the user's want-list

    ```json
    - url : "/users/want"
    - method : PUT
    - authentication : Yes
    - authorization : No
    - requirements : user id sent in req.body.id
    - responses :
        - Status 200 , message : "User added to want list successfully"
        - Status 500 , message : "Error while adding a user to your want-list"
    ```

  - #### Getting all users on the user's want-list

    ```json
    - url : "/users/want"
    - method : GET
    - authentication : Yes
    - authorization : No
    - requirements : none
    - responses :
        - Status 200 , message : none , payload : list of users on the want-list
        - Status 500 , message : "Error while retrieving your want-list"
    ```

  - #### Deleting a user from the user's want-list

    ```json
    - url : "/users/want"
    - method : Delete
    - authentication : Yes
    - authorization : No
    - requirements : user id sent in req.body.id
    - responses :
        - Status 200 , message : "User removed from your want-list successfully"
        - Status 500 , message : "Error while removing a user from your want-list"
    ```

- ### Giveaway list :

  - #### Adding a user to the user's giveaway-list

    ```json
    - url : "/users/giveaway"
    - method : PUT
    - authentication : Yes
    - authorization : No
    - requirements : user id sent in req.body.id
    - responses :
        - Status 200 , message : "User added to giveaway list successfully"
        - Status 500 , message : "Error while adding a user to your giveaway-list"
    ```

  - #### Getting all users on the user's giveaway-list

    ```json
    - url : "/users/giveaway"
    - method : GET
    - authentication : Yes
    - authorization : No
    - requirements : none
    - responses :
        - Status 200 , message : none , payload : list of users on the giveaway-list
        - Status 500 , message : "Error while retrieving your giveaway-list"
    ```

  - #### Deleting a user from the user's giveaway-list

    ```json
    - url : "/users/giveaway"
    - method : Delete
    - authentication : Yes
    - authorization : No
    - requirements : user id sent in req.body.id
    - responses :
        - Status 200 , message : "User removed from your giveaway-list successfully"
        - Status 500 , message : "Error while removing a user from your giveaway-list"
    ```

### Using AWS rekognition to try to find user title in image

```json
- url : "/users/find/title"
- method : GET
- authentication : No
- authorization : No
- requirements : public Url image sent in req.body.img
- responses :
  - Status 200 , message : none , payload : list of strings that might be the title or part of it
  - Status 500 , message : "Error while getting title text from image"
```

### Uploading user cover image to AWS S3 bucket

```json
- url : "/users/image"
- method : GET
- authentication : Yes
- authorization : Yes , admin access
- requirements :
    - public url of the image in req.body.img
    - user id in req.body.id
- responses :
  - Status 200 , message : none , payload : the user of which the id was provided
  - Status 500 , message : "Error while trying to add user image to s3 bucket" ;
```
