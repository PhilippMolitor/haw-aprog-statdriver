const r = require('express').Router();
const bcrypt = require('bcrypt');

// login page
r.get('/login', (req, res) => {
    const { name, error } = req.query;
    res.render('login', {
        name,
        error
    });
});

// login action handler
r.post('/login', (req, res) => {
    const {name, password} = req.body;

    const stmt = req.database.prepare(`SELECT user_id, password_hash
                                       FROM 'users'
                                       WHERE name = @name`);
    const result = stmt.get({ name });

    if (result) {
        // user found
        if (bcrypt.compareSync(password, result.password_hash)) {
            // password correct
            req.authentication.setUserId(result.user_id);
            res.redirect('/dashboard');
        } else {
            // password incorrect
            res.redirect('/auth/login?error=1');
        }
    } else {
        // user not found
        res.redirect('/auth/login?error=2');
    }
});

// logout handler
r.get('/logout', (req, res) => {
    // delete session
    req.authentication.logout();

    // redirect to login page
    res.redirect('/auth/login');
});

// sign-up page
r.get('/signup', (req, res) => {
    const {error} = req.query;
    res.render('signup', {
        error
    });
});

// sign-up action handler
r.post('/signup', (req, res) => {
    const {name, password, passwordConfirm, email} = req.body;

    // check for password
    if (password !== passwordConfirm) {
        // passwords do not match
        res.redirect('/auth/signup?error=1');
    } else {
        // passwords match
        const stmt = req.database
            .prepare(`SELECT name
                      FROM users
                      WHERE name = @name
                         OR email = @email`)
        const result = stmt.get({name, email});

        if (result) {
            // user or email exists, error
            res.redirect('/auth/signup?error=2');
        } else {
            // not yet in database, create user
            const stmt = req.database
                .prepare(`INSERT INTO users (name, password_hash, email)
                          VALUES (@name, @passwordHash, @email)`);
            stmt.run({
                name,
                passwordHash: bcrypt.hashSync(password, 12),
                email
            });

            // redirect to login
            res.redirect('/auth/login?name=' + name);
        }
    }
});

module.exports = r;
