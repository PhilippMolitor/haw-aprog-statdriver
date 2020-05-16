const r = require('express').Router();

// dashboard template (get)
r.get('/', (req, res) => {
    const stmt = req.database
        .prepare(`SELECT game_id as id,
                         name    as name
                  FROM games
                  WHERE owner_id = @owner`);
    const result = stmt.all({
        owner: req.authentication.getUserId()
    });

    res.render('dashboard', {
        games: result
    })
});

// dashboard new game form (get)
r.get('/new-game', (req, res) => {
    res.render('new-game');
});

// dashboard new game handler (post)
r.post('/new-game', (req, res) => {
    const {gameName} = req.body;

    const stmt = req.database
        .prepare(`INSERT INTO games (owner_id, name)
                  VALUES (@owner, @gameName)`);
    const result = stmt.run({
        owner: req.authentication.getUserId(),
        gameName
    });

    res.redirect('/game/' + result.lastInsertRowid);
});

module.exports = r;
