const r = require('express').Router();
const bcrypt = require('bcrypt');

r.get('/', (req, res) => {
    const stmt = req.database
        .prepare(`SELECT name, email
                  FROM users
                  WHERE user_id = @id`);

    const result = stmt.get({
        id: req.authentication.getUserId(),
    });

    res.render('profile', { details: result });
});

// change password get-route
r.get('/change-password', (req, res) => {
    const { error } = req.query;

    res.render('change-password', { error });
});

//change password post-route
r.post('/change-password', (req, res) => {
    const { password, newPassword, newPasswordConfirm } = req.body;

    const stmt = req.database
        .prepare(`SELECT password_hash AS passwordHash
                  FROM users
                  WHERE user_id = @id`);

    const result = stmt.get({
        id: req.authentication.getUserId(),
    });


    if (!bcrypt.compareSync(password, result.passwordHash)) {
        res.redirect('/profile/change-password?error=1');
    } else {
        if (newPassword === newPasswordConfirm) {
            // creating a new password ... if
            if (newPassword !== password) {
                const stmt = req.database
                    .prepare(`UPDATE users
                              SET password_hash = @newPassword
                              WHERE user_id = @id`);
                stmt.run({
                    newPassword: bcrypt.hashSync(newPassword, 12),
                    id: req.authentication.getUserId(),
                });
                //redirect to profile-page
                res.redirect('/profile');
            } else {
                // same password
                res.redirect('/profile/change-password?error=3');
            }
        } else {
            res.redirect('/profile/change-password?error=2');
        }
    }
});

module.exports = r;
