const r = require('express').Router();

// dashboard template (get)
r.get('/', (req, res) => {
    const stmt = req.database
        .prepare(`SELECT g.game_id                       AS id,
                         g.name                          AS name,
                         COUNT(DISTINCT s.scoreboard_id) AS scoreboardCount,
                         COUNT(DISTINCT e.entry_id)      AS entryCount
                  FROM games g
                           LEFT JOIN scoreboards s ON g.game_id = s.game_id
                           LEFT OUTER JOIN entries e ON s.scoreboard_id = e.scoreboard_id
                  WHERE owner_id = @owner
                  GROUP BY g.name
                  ORDER BY g.game_id ASC`);
    const result = stmt.all({
        owner: req.authentication.getUserId(),
    });

    res.render('dashboard', {
        games: result,
    });
});

// dashboard new game form (get)
r.get('/new-game', (req, res) => {
    res.render('new-game');
});

// dashboard new game handler (post)
r.post('/new-game', (req, res) => {
    const { gameName } = req.body;

    const stmt = req.database
        .prepare(`INSERT INTO games (owner_id, name)
                  VALUES (@owner, @gameName)`);
    const result = stmt.run({
        owner: req.authentication.getUserId(),
        gameName,
    });

    res.redirect('/game/' + result.lastInsertRowid);
});

module.exports = r;
