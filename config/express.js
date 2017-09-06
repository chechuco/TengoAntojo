/*
 * Express config file
 */

// Load the module dependencies
const config = require('./config'); 
const express = require('express');
const morgan = require('morgan');
const compress = require('compression');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

// Define the Express configuration method
module.exports = function() {
    const app = express();
    
    /* Registers middleware */
    // Use the 'NDOE_ENV' variable to activate the 'morgan' logger or 'compress' middleware
    if (process.env.NOCE_ENV === 'development') {
        app.use(morgan('dev'));
    } else if(process.env.NOD_ENV ==='production') {
        app.use(compress());
    }
    // Use the 'body-parser' and 'method-override' middleware functions
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(methodOverride());
    // Configure the 'session' middleware
    app.use(session( {
        saveUninitialized: true,
        resave: true,
        secret: config.sessionSecret // secret se confugira según lo indicado en config.js
    }));
    // Set the application view engine and 'views' folder
    app.set('views', './app/views');
    app.set('view engine', 'ejs');
    // Configure the flash messages middleware
    app.use(flash());
    // Configure the Passport middleware
    app.use(passport.initialize());
    app.use(passport.session());

    // Configure static file serving
	app.use('/', express.static(path.resolve('./public'))); // static pages location
	app.use('/lib', express.static(path.resolve('./node_modules'))); //make library files accesible in main EJS view
    
    //Load the routing files
    require('../app/routes/users.server.routes.js')(app); // before index routes ("it will come in handy when dealing with Angular routing mechanism")
    require('../app/routes/index.server.routes.js')(app); // Main entry page

    // Return the Express application instance
    return app;
};