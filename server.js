/* 
 * Main app file
 */

/* Variables declaration */
// Store the enviroment, 'development' by default
// To set the enviroment in UNIX: $ export NODE_ENV=development (or 'production')
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

/* Load and configure middleware */
const configureMongoose = require ('./config/mongoose');
const configureExpress = require ('./config/express');
const configurePassport = require ('./config/passport');

const db = configureMongoose();
const app = configureExpress();
const passport = configurePassport();

/* Open app ears */
app.listen(3000);

/* Module.express object is used to return the  app object, this will help to load and test the Express app */
module.express = app;

console.log('Server running at http://localhost:3000/');