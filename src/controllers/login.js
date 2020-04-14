const r = require('express').Router();

// login page
r.get('/', (req, res) => {
    res.render('login');
});

// login action handler
r.post('/', (req, res) => {
    res.redirect('/login?notimplemented');
});

module.exports = r;
