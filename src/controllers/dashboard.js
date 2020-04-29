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
r.get('/new-game', (req, res) => {
    res.render('new-game');
});

// dashboard new game handler (post)
r.post('/new-game', (req, res) => {
    const gameName = req.body.gameName;
    res.redirect('/dashboard?name=' + gameName);
});

module.exports = r;
