Physique Tracker:
- This project was developed as part of my 3rd year computer science course.
- The idea of this project is to create a way for someone to keep track of their gym progress using a video journal.
- Once a week the user can upload a photo/video of their physique and then view it on their profile page.
- Security is very important for this web app to function correctly, that is why libraries such as 'express-validator', 'express-sanitizer' and 'bcrypt' were used.
bcrypt - hashes the user's password before storing it in a database
express-validator and express-sanitizer - clean the data entered by the user (filters for XSS attacks, SQL injection attacks and others)
- Users can also keep track of their calories using the manage calories page which pulls the calories data from a food api (a user can enter a food name e.g. burger, the api will then search for the relevant food name and retrieve a list of calories for the searched keyword).

Technologies Used: Express(Node.js), MySQL database

Skills Learnt: 
- Working with APIs (developing own api and pulling data from an existing api)
- SQL - CRUD database operations
- Storing the current user session

Video Demo:







(Note to Self):
npm install

npm install express-validator

npm install express-sanitizer

npm install request

npm install express-fileupload

npm install express-session

npm install bcrypt
