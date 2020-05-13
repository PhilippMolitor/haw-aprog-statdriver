const r = require('express').Router();

// middleware for authentication
const { requiresLogin } = require('./middlewares/authentication');

// route controllers
const authController = require('./controllers/auth');
const dashboardController = require('./controllers/dashboard');
const embedController = require('./controllers/embed');
const apiController = require('./controllers/api');

// base redirect
r.get('/', (req, res) => {
    // TODO: check for authentication, and redirect accordingly
    res.redirect('/login');
});

// controllers
r.use('/auth', authController);
r.use('/dashboard', requiresLogin(), dashboardController);
r.use('/embed', embedController);
r.use('/api', apiController);

module.exports = r;
