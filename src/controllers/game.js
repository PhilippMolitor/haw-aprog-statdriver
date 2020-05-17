const r = require('express').Router();

r.get('/:gameId', (req, res) => {
    const { gameId } = req.params;

    const stmt = req.database
        .prepare(`SELECT s.scoreboard_id as scoreboardId,
                         s.name          as name
                  FROM scoreboards s
                           INNER JOIN games g
                                      ON s.game_id = g.game_id
                  WHERE s.game_id = @gameId
                    AND g.owner_id = @owner`);
    const result = stmt.all({
        gameId,
        owner: req.authentication.getUserId(),
    });

    res.render('game', {
        gameId,
        scoreboards: result,
    });
});

r.get('/:gameId/new-scoreboard', (req, res) => {
    res.render('new-scoreboard');
});

r.post('/:gameId/new-scoreboard', (req, res) => {
    const { gameId } = req.params;
    const { scoreboardName } = req.body;

    const stmt = req.database
        .prepare(`INSERT INTO scoreboards (game_id, name, set_key, get_key, embed_title)
                  VALUES (@gameId, @scoreboardName, @setKey, @getKey, @embedTitle)`);
    const result = stmt.run({
        gameId, scoreboardName,
        getKey: 'x', // TODO
        setKey: 'y', // TODO
        embedTitle: scoreboardName,
    });

    res.redirect('/scoreboard/' + result.lastInsertRowid);
});

module.exports = r;
