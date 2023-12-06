module.exports = function(app, shopData) {

    //validator:
    const { check, validationResult } = require('express-validator');

    //sanitiser
    const expressSanitizer = require('express-sanitizer');


    //sanitise:
    app.use(expressSanitizer());

    //API:
    const request = require('request');


    //redirect to the login part if the user isnt signed in:
    const redirectLogin = (req, res, next) => {
        if (!req.session.userId ) {
          res.redirect('./login')
        } else { next (); }
    }
    

    //logout:
     app.get('/logout', redirectLogin, (req,res) => {
         req.session.destroy(err => {
         if (err) {
           return res.redirect('./')
         }
            res.redirect('/');
         })
    })

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
                result = 'Hello '+ req.body.first + ' '+ req.body.last +' you are now registered!  We will send an email to you at ' + req.body.email;
                result += 'Your password is: '+ req.body.password +' and your hashed password is: '+ hashedPassword;
                return res.send(result);
                }
            });
            })
        }
    });

    //track your physique page:
    app.get('/track_physique',redirectLogin, function(req,res){
        res.render('track_physique.ejs', shopData)
    });

    //manage calories page:
    app.get('/manage_calories',redirectLogin, function(req,res){
        res.render('manage_calories.ejs', shopData)
    });

    //view progress page:
    app.get('/loggedin',redirectLogin, function(req,res){
        res.render('loggedin.ejs', shopData)
    });


    //login page backend:
    app.get('/login', function (req,res) {
        res.render('login.ejs', { shopData, errorMessage: null });                                                                  
    });


    //logged in:
    app.get('loggedin',redirectLogin,function(req,res){
        next ();
    });

    app.post('/loggedin', function (req,res) {
        //bcrypt stuff
        const bcrypt = require('bcrypt');

        const username = req.body.username;
        let hashedPassword;

        //sql query:
        let sqlquery = `SELECT hashedPassword FROM users WHERE username='${username}'`;
        
        //get the username for the database and compare the passwords:
        db.query(sqlquery, (err,response) =>{
            if(err){
                //error message displayed if the login/password is incorrect
                res.render("login.ejs", { shopData, errorMessage: "Incorrect username or password" });
            }else{
                //username found successfully:
                hashedPassword = response[0].hashedPassword;

                console.log(hashedPassword)
                // Compare the password supplied with the password in the database
                 
                bcrypt.compare(req.body.password, hashedPassword, function(err, result) {
                    if (err) {
                        //error:
                        res.redirect('./');
                    }
                    else if (result == true) {
                        //when login is successful redirect them to another page:
                        req.session.userId = req.body.username;

                        let username = req.body.username;
                        res.render("loggedin.ejs", { username: username });
                    }
                    else {
                        //error message displayed if the login/password is incorrect
                        res.render("login.ejs", { shopData, errorMessage: "Incorrect username or password" });
                    }
                });
            }
        });
    });
    
}
