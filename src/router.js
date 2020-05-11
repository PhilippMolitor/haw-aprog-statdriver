const r = require('express').Router();

// route controllers
const authController = require('./controllers/auth');
const dashboardController = require('./controllers/dashboard');
const scoreboardController = require('./controllers/scoreboard');
const embedController = require('./controllers/embed');
const apiController = require('./controllers/api');

// base redirect
r.get('/', (req, res) => {
    // TODO: check for authentication, and redirect accordingly
    res.redirect('/login');
});

// controllers
r.use('/auth', authController);
r.use('/dashboard', dashboardController);
r.use('/scoreboard', scoreboardController);
r.use('/embed', embedController);
r.use('/api', apiController);

module.exports = r;
