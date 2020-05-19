const r = require('express').Router();

r.get('/', (req, res) => {


    res.render('profile');
});

//change password
r.post('/profile/password', (req, res) => {
    const {password, new_password, new_passwordConfirm} = req.body;

    if (new_password == new_passwordConfirm) {
        // creating a new password
        if (new_password !== password) {

            //TODO: delete old password

            //TODO: insert new password
            const stmt = req.database
                .prepare(`INSERT INTO users (password_hash)
                          VALUES (@passwordHash)`);

            // same password
        } else {
            res.redirect('/profile/password?error=2');
        }
        ;

    } else {
        res.redirect('/profile/password?error=1');
    }
    ;
});

module.exports = r;
