const r = require('express').Router();
const cors = require('cors');

// middleware for authentication
const { requiresLogin } = require('./middlewares/authentication');

// route controllers
const authController = require('./controllers/auth');
const dashboardController = require('./controllers/dashboard');
const profileController = require('./controllers/profile');
const gameController = require('./controllers/game');
const scoreboardController = require('./controllers/scoreboard');
const embedController = require('./controllers/embed');
const apiController = require('./controllers/api');

// base redirect
r.get('/', (req, res) => {
    if (req.authentication.getUserId()) {
        res.redirect('/dashboard');
    } else {
        res.redirect('/auth/login');
    }
});

// controllers
r.use('/auth', authController);
r.use('/dashboard', requiresLogin(), dashboardController);
r.use('/profile', requiresLogin(), profileController);
r.use('/game', requiresLogin(), gameController);
r.use('/scoreboard', requiresLogin(), scoreboardController);
r.use('/embed', embedController);
r.use('/api', cors(), apiController);

module.exports = r;
