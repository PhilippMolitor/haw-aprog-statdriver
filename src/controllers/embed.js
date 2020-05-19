const r = require('express').Router();

r.get('/scoreboard/:scoreboardId', (req, res) => {
    const { scoreboardId } = req.params;
    const { theme, max, rank } = req.query;

    // default to 10, maximum 100
    const maxEntries = Math.min(parseInt(max) || 10, 100);

    // check if embed is enabled
    const stmt = req.database
        .prepare(`SELECT embed_title as embedTitle
                  FROM scoreboards
                  WHERE scoreboard_id = @id
                    AND embed_enabled = 1`);
    const result = stmt.get({
        id: scoreboardId,
    });

    if (result) {
        const { embedTitle } = result;

        // find scoreboard entries
        const stmt = req.database
            .prepare(`SELECT player_name as name,
                             score       as score,
                             date        as time
                      FROM entries
                      WHERE scoreboard_id = @id
                      ORDER BY score DESC
                      LIMIT @max`);
        const scores = stmt
            .all({
                id: scoreboardId,
                max: maxEntries,
            });

        res.render('embed', {
            theme,
            embedTitle,
            rank,
            scores,
        });
    } else {
        res
            .status(404)
            .send('scoreboard not found');
    }
});

module.exports = r;
