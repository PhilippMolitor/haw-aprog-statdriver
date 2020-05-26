const r = require('express').Router();

// retrieves a scoreboard from the database
r.get('/scoreboard/:scoreboardId', (req, res) => {
    const apiGetKey = req.header('Authorization');
    const maxTopEntries = parseInt(req.query.max) || 10;
    const { scoreboardId } = req.params;

    // retrieve "get" key
    const stmt = req.database.prepare(`SELECT game_id
                                       FROM 'scoreboards'
                                       WHERE scoreboard_id = @id
                                         AND get_key = @key`);
    const result = stmt
        .get({
            id: scoreboardId,
            key: apiGetKey,
        });

    if (result) {
        // find scoreboard entries
        const stmt = req.database
            .prepare(`SELECT *
                      FROM 'entries'
                      WHERE scoreboard_id = @id
                      ORDER BY score DESC
                      LIMIT @max`);
        const result = stmt
            .all({
                id: scoreboardId,
                max: maxTopEntries,
            })
            .map(entry => ({
                name: entry.player_name,
                score: entry.score,
                time: entry.date,
            }));

        res.send({
            status: true,
            message: '',
            payload: result,
        });
    } else {
        // scoreboard does not exist or get key is wrong
        res
            .status(400)
            .send({
                status: false,
                message: 'scoreboard or get key wrong',
                payload: [],
            });
    }
});

// creates a new scoreboard entry
r.post('/scoreboard/:scoreboardId', (req, res) => {
    const apiSetKey = req.header('Authorization');
    const { scoreboardId } = req.params;
    const { name, score } = req.body;

    // retrieve "set" key
    const stmt = req.database.prepare(`SELECT game_id
                                       FROM 'scoreboards'
                                       WHERE scoreboard_id = @id
                                         AND set_key = @key`);
    const result = stmt
        .get({
            id: scoreboardId,
            key: apiSetKey,
        });

    if (result) {
        const stmt = req.database.prepare(`INSERT INTO entries (scoreboard_id, player_name, score, date)
                                           VALUES (@id, @name, @score, @date)`);
        const result = stmt.run({
            id: scoreboardId,
            name, score,
            date: Math.round(Date.now() / 1000),
        });

        if (result.changes > 0) {
            const stmt = req.database.prepare(`SELECT COUNT(*) AS count
                                               FROM entries
                                               WHERE scoreboard_id = @id
                                                 AND score >= @score`);
            const result = stmt.get({
                id: scoreboardId,
                score,
            });

            res.send({
                status: true,
                message: 'entry submitted to scoreboard',
                payload: {
                    rank: result.count,
                },
            });
        } else {
            res
                .status(400)
                .send({
                    status: false,
                    message: 'invalid player name or score value',
                    payload: [],
                });
        }
    } else {
        // scoreboard does not exist or get key is wrong
        res
            .status(400)
            .send({
                status: false,
                message: 'scoreboard or set key wrong',
                payload: [],
            });
    }

    res.send();
});

module.exports = r;
