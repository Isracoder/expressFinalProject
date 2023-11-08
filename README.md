# Express Bootcamp Final Project 🥇🤞

Final Project for the 100 day long intensive express and aws training by gsg.

## Online Library and Book Review Website 📖🫀

### Project Overview 📔

My goal is to create a website that functions as a mix between other popular book collection
websites (ex : Goodreads) and a local library website.
Users on this website can 📘:
  - Befriend other users and connect with them
  - Leave book reviews
  - Search for books and check their availability in libraries near you
  - Add books to lists (want-list , giveaway-list , etc...)
  - Be notified when books you want are available nearby
  - Understand your reading habits via graphs
  - Get friend recommendations of books
  - Upload image of a book and get the title
  - Set up book swaps with other users

<p align="center">
  <img src="https://i.pinimg.com/564x/27/ed/a9/27eda9aa1138ac8f631b4e06614a430e.jpg" alt="bookstoreImage"/>
</p>

The Project should :

- Be secure
- Be scalable
- Use CI/CD methodologies
- Handle errors and include Unit tests
- Optomize Performance

## Technologies used 🤓💻 :
To create the project api's I worked with nodejs and the express framework and to render the graphs I used the chartjs library.In terms of cloud services I worked with the AWS console using numerous resources such as EC2 instances, s3 buckets, RDS ,target groups, load balancers, and autoscale groups. I also made use of several cool aws services in my api's such as SES , and aws rekognition. To set up the CI/CD pipeline I used github actions. In addition to all of that I also employed docker containers inside my auto-scale group instances and would package the docker image and upload it via github actions to the github registry. 

## Project ERD 🖋️💠

![alt text](./finalProjERD.drawio.svg)

<!-- <details>
<summary>SVG code</summary>

```
@sample.svg
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="90px" height="81px" viewBox="-0.5 -0.5 121 81" style="background-color: rgb(255, 255, 255);">
    <defs/>
    <g>
        <ellipse cx="60" cy="40" rx="60" ry="40" fill="#ffffff" stroke="#000000" pointer-events="all"/>
    </g>
</svg>
@sample.svg
```

</details> -->

## Problems Faced :

- Issues with AWS RDS -> Overcame it with the help of waleed and prof khaled
- deployment issues -> Overcame by myself
- db connectivity issues after deployment -> Overcame it with the help of waleed

### Api Documentation

There are several routes in the main index file , each of which I've created a separate docs page for :

- /reviews
- /books
- /libraries
- /roles
- /users
- /genres
- /permissions
- /copies

#### Links to Documentation pages :

[For the Review Routes](./API-Docs/Review.md)  
[For the Book Routes](./API-Docs/Book.md)  
[For the Copy Routes](./API-Docs/Copy.md)  
[For the Library Routes](./API-Docs/Library.md)  
[For the Role Routes](./API-Docs/Role.md)  
[For the Genre Routes](./API-Docs/Genre.md)  
[For the User Routes](./API-Docs/User.md)  
[For the Permission Routes](./API-Docs/Permission.md)

Please do not use anything from this repository without my permission.
