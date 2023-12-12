module.exports = function(app, shopData) {
    //validator:
    const { check, validationResult } = require('express-validator');

    //sanitiser
    const expressSanitizer = require('express-sanitizer');

    //sanitise:
    app.use(expressSanitizer());

    //file upload library and paths:
    let path = require('path');
    var fileUpload = require('express-fileupload');
    app.use(fileUpload());
    const fs = require('fs')

    //API:
    const request = require('request');

    //redirect to the login part if the user isnt signed in:
    const redirectLogin = (req, res, next) => {
        if (!req.session.userId ) {
          res.redirect('/login')
        } else { next (); }
    }
    

    //logout:
    app.get('/logout', redirectLogin, (req, res) => {
        req.session.destroy(err => {
            if (err) {
                return res.redirect('/');
            }
            res.redirect('/');
        });
    });


    // Handle our routes
    app.get('/',function(req,res){
        res.render('index.ejs', shopData)
    });

    app.get('/register', function (req,res) {
        res.render('register.ejs', { shopData, errorMessage: null });                                                                    
    });                                                                                                 
    app.post('/registered',[
        check('email').isEmail().normalizeEmail(),
        check('username').trim().escape()
    ], function (req,res) {
        //enter correct email or redirect back to register page
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('register.ejs', { shopData, errorMessage: 'Something Went Wrong, please check that you have filled in all the form components' }); }
        else {
        const bcrypt = require('bcrypt');
        const saltRounds = 10;
        const plainPassword = req.body.password;
        if(plainPassword.length < 8){
            return res.render('register.ejs', { shopData, errorMessage: 'Password must be at least 8 characters in length' });
        }
        const first = req.sanitize(req.body.first)//validates the first name
        const last = req.sanitize(req.body.last)//validates the last name
        const email = req.sanitize(req.body.email)//sanitises email
        const username = req.sanitize(req.body.username)//sanitises username

        // Check if the username already exists in the database
        let sqlquery = `SELECT * FROM users WHERE username = ?`;

        // username already exists?
        db.query(sqlquery, [username], (err, result) => {
            if (err) {
                // Handle the database error, for example, redirect to the registration page with an error message.
                return res.render('register.ejs', { shopData, errorMessage: 'There seems to be an error with our system, please try again later' });
            }
            if (result.length > 0) {
                // Username already exists
                return res.render('register.ejs', { shopData, errorMessage: 'Sorry, username already exists' });
            }
        });

        bcrypt.hash(plainPassword, saltRounds).then(hashedPassword => {
            // Construct the SQL query after password hashing is complete
            let sqlquery = `INSERT INTO users (username, first_name, last_name, email, hashedPassword) VALUES (?, ?, ?, ?, ?)`;

            // Execute the query and handle the result
            db.query(sqlquery, [username, first, last, email, hashedPassword], (err, result) => {
                if (err) {
                    return res.render('register.ejs', { shopData, errorMessage: 'There seems to be an error with our system, please try again later' });
                } else {
                // Data inserted successfully:
                    // result = 'Hello '+ req.body.first + ' '+ req.body.last +' you are now registered!  We will send an email to you at ' + req.body.email;
                    // result += 'Your password is: '+ req.body.password +' and your hashed password is: '+ hashedPassword;
                    req.session.userId = req.body.username;
                    return res.redirect('/');
                }
            }); 
            })
        }
    });

    app.get('/about',function(req,res){
        res.render('about.ejs', shopData)
    });


    //function to get the type of file that is being passed in:
    function yesVideo(filePath) {
        let videoExtensions = ['.mp4', '.avi', '.mov'];
        let ext = path.extname(filePath).toLowerCase();
        return videoExtensions.includes(ext);
    }

    function findClosestDate(result){
        let todaysDate = new Date();
        let closestDate = null;
        let minDiff  = Infinity;
        // Find the closest date
        for (const row of result) {
            // Convert the date_uploaded from the row to a Date object
            let uploadedDate = new Date(row.date_uploaded);
            // Calculate the difference in days
            let diff = Math.abs((todaysDate - uploadedDate) / (1000 * 60 * 60 * 24));
            // Check if this date is closer than the current closest date
            if (diff < minDiff) {
                closestDate = row;
                minDiff = diff;
            }
        }
        return [closestDate,minDiff];
    };

    //track your physique page get request:
    app.get('/track_physique', redirectLogin, function(req, res) {
        let userId = req.session.userId;
        let sqlquery = "SELECT * FROM progress WHERE user_id = (SELECT user_id FROM users WHERE username = ?)";//query to check the userID

        db.query(sqlquery, [userId], (err, result) => {
            // SQL query error:
            if (err) {
                return res.status(500).send('Database Error when searching for the user');
            }
            // If the user has a physique image, render the page with the option to update it
            if (result.length > 0) { 
                [closestDate, minDiff]= findClosestDate(result)
                //if it hasn't been a week yet:
                if(minDiff < 7){
                    let imagePath = closestDate.path_to;
                    return res.render('track_physique.ejs', { shopData, hasFile: true, imagePath, error:null});
                }
                //has been longer than a week:
                else{
                    return res.render('track_physique.ejs', { shopData, hasFile: false, error:null });
                }
            } else {
                //user doesn't have an image on their profile at all:
                return res.render('track_physique.ejs', { shopData, hasFile: false, error:null });
            }
        });
    });

    //remove the image from the database:'
    app.post('/remove-physique', redirectLogin, function(req, res){
        let username = req.session.userId;
        let sqlquery = "SELECT * FROM progress WHERE user_id = (SELECT user_id FROM users WHERE username = ?)";//query to check the userID and return the stuff from progress table

         db.query(sqlquery, [username], (err, result) => {
            if (err) {
                return res.status(500).send('Database Error when searching for the user');
            }
            else if(result.length === 0){
                return res.status(404).send('User not found OR Nothing to remove');
            }
            else{
                //find closest date and minDiff:
                [closestDate, minDiff] = findClosestDate(result);
                //remove it:
                let sqlquery = "DELETE FROM progress WHERE progress_id = ?";
                db.query(sqlquery, [closestDate.progress_id], (err,result) =>{
                    //errror:
                    if(err){
                        return res.status(500).send("Database Error when removing the Image")
                    }
                    else{
                        //if the deletion process was succesful:
                        return res.render('track_physique.ejs', { shopData, hasFile: false, error:null});
                    }
                })
            }
         });         
    });

    //physique tracker image upload method:
    app.post('/track_physique', redirectLogin, function(req, res){
        let userId = req.session.userId; // userId
        // generate the path to store the img/vid:
        let uploadPath = path.resolve(__dirname, '..', 'public', 'uploads');
        // Check if the directory exists, and create it if not
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        //find the userID
        let sqlquery = "SELECT user_id FROM users WHERE username = ?";

        db.query(sqlquery, [userId], (err, result) => {
            if (err) {
                return res.status(500).send('Database Error when searching for the user');
            }
            else if(result.length === 0){
                return res.status(404).send('User not found');
            }
            //if the user is found:
            else{
                userId = result[0].user_id//store the userID

                //current Img file path and name:
                let imageFile = req.files.imageFile;
                let newFileName = `${Date.now()}_${imageFile.name}`;
                let newImagePath = path.join(uploadPath, newFileName);//store the img

                //check if the user uploaded a video (NOT supported):
                if(yesVideo(newImagePath)){
                    return res.render('track_physique.ejs', { shopData, hasFile: false, error:"Unable to process your request, our system doesn't support videos"});
                }

                 // Get today's date: 
                let currentDate = new Date();
                let formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;

                // Re-store the image file:
                imageFile.mv(newImagePath, function(err) {
                    if (err) {
                        return res.status(500).send("There was a problem with storing your image file");
                    }

                    // Store the file in the database along with the current date and time:
                    sqlquery = "INSERT INTO progress (user_id, date_uploaded, path_to) VALUES (?, ?, ?)";


                    //store the img/vid:
                    db.query(sqlquery, [userId, formattedDate, newFileName], (err, result) => {
                        if (err) {
                            return res.status(500).send("There was a problem with storing your image file");
                        }
                        // Render the page with the image uploaded
                        res.render('track_physique.ejs', { shopData, hasFile: true, imagePath: newFileName, error:null });
                    });
                });
            }
        });
    });




    //manage calories page default:
    app.get('/manage_calories', redirectLogin, function (req, res) {
        res.render('manage_calories.ejs', { shopData, food_array: [], customFoods, totalCalories });
    });


    //Total Calories glob varaibles:
    let customFoods = [];//stores foods
    let totalCalories = 0; //total
    // Handle form submission for adding custom food
    app.post('/add-custom-food', (req, res) => {
        const { customFoodName, calories } = req.body;
        // Add the custom food item to the array
        customFoods.push({
            customFoodName,
            calories: calories,
        });
        totalCalories = parseInt(totalCalories)+parseInt(calories);// Update the total calories
        res.render('manage_calories.ejs', { shopData, food_array: [], customFoods, totalCalories });// Render the page
    });

    // Handle removal of custom food item
    app.post('/remove-custom-food/:customFoodName', (req, res) => {
        const { customFoodName } = req.params;
        const method = req.body._method || req.query._method;// Check if the _method parameter is present
        // Check if the request is a DELETE
        if (method === 'DELETE') {
            const index = customFoods.findIndex(item => item.customFoodName === customFoodName);// Find the index
            if (index !== -1) {
                totalCalories -= customFoods[index].calories;//subtract from total
                customFoods.splice(index, 1);// Remove from array
            }
            // Render the page
            return res.render('manage_calories.ejs', { shopData, food_array: [], customFoods, totalCalories });
        }
        // Method is something else display this error:
        res.status(405).send('Error!');
    });



    //manage calories api:
    app.get('/search-calories', (req, res) => {
        const foodName = req.query.foodName;
        // keys:
        const appId = '1c372e6a';
        const appKey = '3387bd7662b53c67390eb9a7113c32cd';
        //API to pull from:
        const apiUrl = `https://trackapi.nutritionix.com/v2/search/instant/?query=${encodeURIComponent(foodName)}`;

        //Send the API request:
        request(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-app-id': appId,
                'x-app-key': appKey,
            },
        }, (error, response, body) => {
            if (error) {
                console.error('Error fetching data:', error);
                res.status(500).send('Internal Error');
                return;
            }

            const data = JSON.parse(body);//process the response
            const food_array = extractCalories(data);// Extract calories from the response data

            // Render the page with the data:
            res.render('manage_calories.ejs', { shopData, food_array, customFoods, totalCalories });
        });
    });

    // process the data from the API:
    function extractCalories(data) {
        const food_array = [];
        // check that the data isnt empty:
        if (typeof data === 'object' && data !== null) {
            //loop through the objects:
            Object.keys(data).forEach(category => {
                // Check if the category has an array with items
                if (Array.isArray(data[category])) {
                    data[category].forEach(item => {
                        // Check if the item has both food_name and nf_calories (prevents errors)
                        if (item.food_name && item.nf_calories) {
                            // Create a new object with food name and calories
                            const foodObject = {
                                foodName: item.food_name,
                                calories: item.nf_calories
                            };
                            // Push the object to the food_array
                            food_array.push(foodObject);
                        }
                    });
                }
            });
        }
        // Return the array containing food names and calories
        return food_array.length > 0 ? food_array : null;
    }

    //view progress page:
    app.get('/loggedin',redirectLogin, function(req,res){
        let username = req.session.userId; // userId
        //find the user and retrieve the the progress:
        let sqlquery = "SELECT * FROM progress WHERE user_id = (SELECT user_id FROM users WHERE username = ?)"
        db.query(sqlquery, [username], (err, result) => {
            if(err){
                return res.status(500).send('Database Error when searching for the user');
            }
            else{
                resultsList = [];
                for (let i = result.length - 1; i >= 0; i--) {
                    resultsList.push({ date: result[i].date_uploaded,image_path: result[i].path_to});
                }
                
                res.render("loggedin.ejs", { username: username, resultsList: resultsList });
            }
        });
    });


    //login page backend:
    app.get('/login', function (req,res) {
        res.render('login.ejs', { shopData, errorMessage: null });                                                                  
    });

    //log in
    app.post('/loggedin', function (req, res) {
        const bcrypt = require('bcrypt');
        const username = req.body.username;

        // SQL query:
        let sqlquery = `SELECT hashedPassword FROM users WHERE username=?`;

        if (username == "" || req.body.password == "") {
            // user hasn't provided anything
            res.render("login.ejs", { shopData, errorMessage: "Incorrect username or password" });
        } else {
            // get the username from the database and compare the passwords:
            db.query(sqlquery, [username], (err, response) => {
                if (err) {
                    // error message displayed if the login/password is incorrect
                    res.render("login.ejs", { shopData, errorMessage: "Incorrect username or password" });
                } else {
                    // Check if any records were found
                    if (response && response.length > 0) {
                        // username found successfully:
                        let hashedPassword = response[0].hashedPassword;

                        //console.log(hashedPassword);
                        // Compare the password supplied with the password in the database
                        bcrypt.compare(req.body.password, hashedPassword, function (err, result) {
                            if (err) {
                                // error:
                                res.render("login.ejs", { shopData, errorMessage: "An error occurred during login" });
                            } else if (result == true) {
                                // when login is successful redirect them to another page:
                                let username = req.body.username;

                                //find the user and retrieve the the progress:
                                let sqlquery = "SELECT * FROM progress WHERE user_id = (SELECT user_id FROM users WHERE username = ?)"
                                db.query(sqlquery, [username], (err, result) => {
                                    if(err){
                                        return res.status(500).send('Database Error when searching for the user');
                                    }
                                    else{
                                        // Save user session here, when login is successful
                                        req.session.userId = req.body.username;
                                        resultsList = [];
                                        for (let i = result.length - 1; i >= 0; i--) {
                                            resultsList.push({ date: result[i].date_uploaded,image_path: result[i].path_to});
                                        }
                                        res.render("loggedin.ejs", { username: username, resultsList: resultsList });
                                    }
                                });
                            } else {
                                // error message displayed if the login/password is incorrect
                                res.render("login.ejs", { shopData, errorMessage: "Incorrect username or password" });
                            }
                        });
                    } else {
                        // No user found with the given username
                        res.render("login.ejs", { shopData, errorMessage: "Incorrect username or password" });
                    }
                }
            });
        }
    });

    
}
