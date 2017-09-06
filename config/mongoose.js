/*
 * Mongoose config file
 */

// Load the module dependencies
const config = require('./config');
const mongoose = require('mongoose');

module.exports = function() {
    // Use Mongoose to connect to MongoDB
    const db = mongoose.connect(config.db);

    // Load models
    require('../app/models/user.server.model');

    // Return the Mongoose connection instance
    return db;
};