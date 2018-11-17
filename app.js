// Required Modules
    const express           = require('express');
    const mysql             = require('mysql');                 
    const bodyParser        = require('body-parser');           
    const connection        = require('express-myconnection');
    const session           = require('express-session');
    const cookieParser      = require('cookie-parser');   
    const expressValidator  = require('express-validator');
    const flash             = require('express-flash');  

const app               = express();

// Import database and server settings
    const config    = require('./config/config');
// Import routes
    const login              = require('./routes/authentification/login');
    const register           = require('./routes/authentification/register');
    const homepage           = require('./routes/home');
    const createContact      = require('./routes/userProfile/contact/create-contact');
    const updateContact      = require('./routes/userProfile/contact/update-contact');
    const deleteContact      = require('./routes/userProfile/contact/delete-contact');
    const homepageProfile    = require('./routes/userProfile/homepage-profile');

// Setting up engine template
    app.set('view engine', 'ejs');
// Setting up Database Params
    const dbCfg = {
        host:       config.database.host,
        user:       config.database.user,
        password:   config.database.password,
        port:       config.database.port,
        database:   config.database.database
    };
// Middlewares
    app.use(connection(mysql, dbCfg, 'pool'));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(session({
        secret: 'dosentmatter@@#!23324d',
        resave: false,
        saveUninitialized: true,
      }));
    app.use(flash());
    app.use(express.static('./public'));
    app.use(expressValidator());
// Routes
    app.use('/',                 homepage);
    app.use('/authentification', login);
    app.use('/authentification', register)
    app.use('/my-profile',       homepageProfile);
    app.use('/my-profile',       createContact);
    app.use('/my-profile',       updateContact);
    app.use('/my-profile',       deleteContact);
// Handling the routes witch doesn't exist  
        app.use((req,res,next) => {
            res.status(404).send();
        });


    app.listen(config.server.port, function (err) { 
    if(err) throw err;
    console.log(`Server was started and listen to port ${config.server.port}`);
 })