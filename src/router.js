const r = require('express').Router();
const loginController = require('./controllers/login');

// base redirect
r.get('/', (req, res) => {
    // TODO: check for authentication, and redirect accordingly
    res.redirect('/login');
});

// controllers
r.use('/login', loginController);

module.exports = r;
