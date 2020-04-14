const r = require('express').Router();

r.get('/', (req, res) => {
    res.render('login');
});

r.post('/', (req, res) => {
    res.redirect('/login?notimplemented');
});

module.exports = r;
