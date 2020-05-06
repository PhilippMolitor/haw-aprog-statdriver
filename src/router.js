const r = require('express').Router();

// route controllers
const authController = require('./controllers/auth');
const dashboardController = require('./controllers/dashboard');

// base redirect
r.get('/', (req, res) => {
    // TODO: check for authentication, and redirect accordingly
    res.redirect('/login');
});

// controllers
r.use('/auth', authController);
r.use('/dashboard', dashboardController);

module.exports = r;
