const r = require('express').Router();

// dashboard template (get)
r.get('/', (req, res) => {
    res.render('dashboard', {
        games: [
            {
                name: "TestGame",
                id: 42
            },
            {
                name: "TestGame New",
                id: 43341
            }
        ]
    });
});

// dashboard new game form (get)


// dashboard new game handler (post)


module.exports = r;
