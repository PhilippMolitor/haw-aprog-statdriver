const r = require('express').Router();

// middleware for authentication
const { requiresLogin } = require('./middlewares/authentication');

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
r.use('/dashboard', requiresLogin(), dashboardController);

module.exports = r;
