/*
 * Local authentication strategy
 */

// Load the module dependencies
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('mongoose').model('User');

// Create the Local strategy configuration method
module.exports = function() {
    // Use the Passport's Local strategy 
    passport.use(new LocalStrategy((username, password, done) => {
        // Use the 'User' model 'findOne' method to find a user with the current username
        User.findOne({
            username: username
        }, (err, user) => {
            // If an error occurs continue to the next middleware
            if (err) {
                return done(err);
            }

            // If a user was not found, continue to the next middleware with an error message
            if (!user) {
                return done(null, false, {
                    message: 'Usuario desconocido'
                });
            }

            // If the passport is incorrect, continue to the next middleware with an error message
            if (!user.authenticate(password)) {
                console.log('Error de autenticación con el password %s', password);
                return done(null, false, {
                    message: 'Contraseña inválida'
                });
            }

            // Otherwise, continue to the next middleware with the user object
            return done(null, user);
        });
    }));
};