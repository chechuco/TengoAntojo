/*
 * User Model
 */

// Load the module dependencies
const mongoose = require('mongoose');
const crypto = require('crypto');
const Schema = mongoose.Schema;

const UserSchema = new Schema ({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        index: true,
        match: [/.+\@.+\..+/, "La dirección de mail no es válida"]
    },
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true // not working???
    },
    role: {
        type: String,
        enum: ['Administrator', 'User', 'Creator', 'Visitor']
    },
    password: {
        type: String,
        validate: [ // Custom validator
            (password) => password && password.length >= 6,
            /* Equivalente a:
            function(password) {
                return password.length >= 6;
            }
            */
            'El password debe tener al menos seis caracteres'
        ]
    },
    salt: { // Used to hash the password
        type: String
    },
    provider: { // Strategy used to register the user
        type: String,
        required: 'Es necesario indicar un authentication provider (Local, Google, Facebook, Twitter).'
    },
    providerId: String, // User id for the authentication strategy
    providerdata: {}, // Stores the user object retrieved from Oath providers
    website: {
        type: String,
        set: function(url) {
            if (!url) {
                return url;
            } else {
                if (url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0) {
                    url = 'http://' + url;
                }
                return url;
            }
        }
    },
    created: {
        type: Date,
        default: Date.now
    }
});

// Set virtual properties
UserSchema.virtual('fullName').get(function() {
    return this.firstName + ' ' + this.lastName;
}).set(function(fullName){
    const splitName = fullName.split(' ');
    this.firstName = splitName[0] || '';
    this.lastName = splitName[1] || '';
});

// Pre-middleware and methods for authentication
UserSchema.pre('save', function(next) {
    // Hash the password
    if (this.password) {
        this.salt = new Buffer(crypto.randomBytes(16), toString('base64'), 'base64');
        this.password = this.hashPassword(this.password);
    }
    next();
});

UserSchema.methods.hashPassword = function(password) {
    // Custom instance method for hashing a password
    return crypto.pbkdf2Sync(password, this.salt, 10000, 64, 'sha512').toString('base64');
};

UserSchema.methods.authenticate = function(password) {
    // Custom instance method for authenticating user
    return this.password === this.hashPassword(password);
};

UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
    // Custom static methods to find an unique username for new user (used with OAth authentication)
    var possibleUsername = username + (suffix || '');
    this.findOne({
        username: possibleUsername
    }, (err, user) => {
        // If an error occurs call the callback with a null value, otherwise find find an available unique username
        if (!err) {
            if(!user) {
                callback(possibleUsername); // returns the new username
            } else {
                return this.findUniqueUsername(username, (suffix || 0) + 1, callback);
            }
        } else {
            callback(null);
        }
    });
};

UserSchema.statics.findOneByUserName = function(username, callback) {
    // Custom static methods to find an user by username
    this.findOne({ username: new RegExp(username, 'i') },
    callback);
}; // Similar to using an standar static method by calling directly from the User model: User.findOneByUsername('username', (err, user) => { ... });


// Configure the 'UserSchema' to use getters and virtuals when transforming to JSON
UserSchema.set('toJSON', {
    getters: true,
    virtuals: true
});

mongoose.model('User', UserSchema);