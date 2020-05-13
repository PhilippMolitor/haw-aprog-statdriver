const r = require('express').Router();

r.get('/scoreboard/:scoreboardId', (req, res) => {
    const { scoreboardId } = req.params;
    const { theme, max, rank } = req.query;

    // default to 10, maximum 100
    const maxEntries = Math.min(parseInt(max) || 10, 100);

    // check if embed is enabled
    const stmt = req.database
        .prepare(`SELECT embed_title
                  FROM scoreboards
                  WHERE scoreboard_id = @id
                    AND embed_enabled = 1`);
    const result = stmt.get({
        id: scoreboardId
    });
    const title = result.embed_title;

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
                max: maxEntries
            })
            .map(entry => ({
                name: entry.player_name,
                score: entry.score,
                time: entry.date
            }));

        res.render('embed', {
            theme,
            title,
            rank,
            scores: result
        });
    } else {
        res
            .status(404)
            .send('scoreboard not found');
    }
});

module.exports = r;
