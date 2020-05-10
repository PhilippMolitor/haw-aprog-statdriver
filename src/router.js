const r = require('express').Router();

// route controllers
const loginController = require('./controllers/login');
const dashboardController = require('./controllers/dashboard');
const apiController = require('./controllers/api');

// base redirect
r.get('/', (req, res) => {
    // TODO: check for authentication, and redirect accordingly
    res.redirect('/login');
});

// controllers
r.use('/login', loginController);
r.use('/dashboard', dashboardController);
r.use('/api', apiController);

module.exports = r;
