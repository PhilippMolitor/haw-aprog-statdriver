const r = require('express').Router();
const bcrypt = require('bcrypt');

// login page
r.get('/login', (req, res) => {
    res.render('login');
});

// login action handler
r.post('/login', (req, res) => {
    const { name, password } = req.body;

    const stmt = req.database.prepare(`SELECT user_id, password_hash
                          FROM 'users'
                          WHERE name = @name`);
    const result = stmt.get({ name });

    if(result) {
        // user found
        if(bcrypt.compareSync(password, result.password_hash)) {
            // password correct
            req.authentication.setUserId(result.user_id);
            // TODO: redirect to dashboard page
            res.redirect('/dashboard');
        } else {
            // password incorrect
            // TODO: redirect to error page
        }
    } else {
        // user not found
        // TODO: redirect to error page
    }

    res.redirect('/login?notimplemented');
});

// logout handler
r.get('/logout', (req, res) => {
    // delete session
    req.authentication.logout();

    // redirect to /login
    res.redirect('/login');
});

// sign-up page
r.get('/signup', (req, res) => {
    res.render('signup');
});

// sign-up action handler
r.post('/signup', (req, res) => {
    res.redirect('/signup?notimplemented');
});

module.exports = r;
