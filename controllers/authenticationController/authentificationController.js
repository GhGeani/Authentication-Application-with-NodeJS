 // Required module for hash password
    const passwordHash = require('password-hash');

module.exports.registerUser = (req,res) => {
    // User validation
        req.checkBody("email").notEmpty().withMessage("E-mail field it's empty")
                                        .isEmail().withMessage("Invalid e-mail");

        req.checkBody("username").notEmpty().withMessage("Username filed is empty")
                                            .isAlphanumeric().withMessage("Username must contain only numbers and letters");

        req.checkBody("password").notEmpty().withMessage("Password field is empty")
                                            .isLength({min: 4}).trim().withMessage("Password must contain 4 caracters at least")
                                            .isAlphanumeric().withMessage("The password must contain only numbers and letters");

        req.checkBody("repeat_password").equals(req.body.password).withMessage("The password is not the same");

var errors = req.validationErrors();
    
    var user = {
        email:      req.sanitize('email').trim(),
        username:   req.sanitize('username').trim(),
        password:   req.sanitize('password').trim(),
     }
    if(errors) {
        console.log(errors);
        //req.flash('error', 'Input ERROR. Check console.');
        res.render('authentification/register', {
            title:      'Register Page',
            email:      user.email,
            username:   user.username,
            password:   '',
            repeat_password: '',
            errors: errors
        });
    } else {
       
        // Hash the password
            var hashedPassword = passwordHash.generate(user.password);
        //console.log('Hashed Password: ' + hashedPassword);
        req.getConnection((err, conn) => {
            if(err){
                // Flash error - connection
            } else {
                conn.query('SELECT * FROM user WHERE user.email= ? OR user.username= ?',[user.email, user.username], (err, results) => {
                    if(results != 0){
                        //console.log(results);
                        // Flash error - account already exist
                        req.flash('error', 'Username or E-mail already exist!');
                        res.render('authentification/register', {
                            title:      'Register Page',
                            email:      user.email,
                            username:   user.username,
                            password:   '',
                            repeat_password: ''
                        });
                    } else {
                        var preparedUser = {
                            email:      user.email,
                            username:   user.username,
                            password:   hashedPassword
                        }
                        conn.query('INSERT INTO user SET ?', preparedUser, (err, result) => {
                            if(err){
                                console.log(err);
                            }
                             // Flash success alert - accoust successifully created
                             req.flash('success', 'Account successfully registred.')   
                             res.redirect('login');
                        });
                    }
                });
            }
        });
        
        
    }
}

module.exports.loginUser = (req,res) => {
    req.checkBody("username").notEmpty().withMessage("Username field is empty");
    req.checkBody("password").notEmpty().withMessage("Password field is empty");

    var errors = req.validationErrors();
    if(errors){
        req.flash('error', 'Input ERRORS. Check console!');
        console.log(errors);
        // Flash validation fields errors
        res.render('authentification/login', {
            title:      'Login Page', 
            username:   req.body.username,
            password:   '',
            errors:     errors
        });
    } else {
        req.getConnection((err, conn) =>{
            if(err) {
                // Flash connection error
            } else {
                conn.query('SELECT * FROM user WHERE user.username= ?', req.body.username, (err, result) =>{
                    if(result == 0){
                        req.flash('error', 'Account does not exit');
                        // Flash error - account doesn't exist
                        console.log('Accout doesnt exist');
                        res.render('authentification/login', {
                            title:      'Login Page', 
                            username:   req.body.username,
                            password:   ''
                        });
                    } else {
                        if(!passwordHash.verify(req.body.password, result[0].password)){
                            req.flash('error', 'Invalid account');
                            // Flash error - Invalid account
                            console.log('Invalid username or password'); 
                            res.render('authentification/login', {
                                title:      'Login Page', 
                                username:   req.body.username,
                                password:   '',
                            });
                        } else {
                            req.session.username = result[0].username;
                            req.session.user_id  = result[0].id;
                            res.redirect('/my-profile/home')
                        }
                    }
                });
            }
        });
    }
}