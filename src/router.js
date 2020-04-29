const r = require('express').Router();

// route controllers
const loginController = require('./controllers/login');
const dashboardController = require('./controllers/dashboard');

// base redirect
r.get('/', (req, res) => {
    // TODO: check for authentication, and redirect accordingly
    res.redirect('/login');
});

// controllers
r.use('/login', loginController);
r.use('/dashboard', dashboardController);

module.exports = r;
