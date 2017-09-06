/*
 * Index router
 */

// Load the 'index' controller
const index = require('../controllers/index.server.controller');

// Define the routes module' method
module.exports = function(app) {
    // Mount the 'index' controller's 'render' method
    app.get('/*', index.render); // The * assures that the app return to the main app view when receiving not defined routes
};