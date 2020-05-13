const r = require('express').Router();

// creates a new scoreboard
r.post('/', (req, res) => {
    const { gameId, scoreboardName } = req.body;

});

// shows a scoreboard
r.get('/:scoreboardId', (req, res) => {
    const { scoreboardId } = req.params;
    const { maxEntries, pastDays } = req.query;

    // check for scoreboard
    const stmt = req.database
        .prepare(`SELECT s.name          as scoreboardName,
                         s.game_id       as gameId,
                         s.set_key       as setKey,
                         s.get_key       as getKey,
                         s.embed_enabled as embedEnabled,
                         s.embed_title   as embedTitle
                  FROM scoreboards s
                           INNER JOIN games g ON
                      s.game_id = g.game_id
                  WHERE scoreboard_id = @id
                    AND g.owner_id = @owner`);
    const result = stmt
        .get({
            id: scoreboardId,
            owner: req.authentication.getUserId()
        });

    if (result) {
        const { scoreboardName, gameId, setKey, getKey, embedEnabled, embedTitle } = result;
        
        // game name
        const gameStmt = req.database
            .prepare(`SELECT name as gameName
                      FROM games
                      WHERE game_id = @id`);
        const { gameName } = gameStmt
            .get({
                id: gameId
            });

        // entries
        const entryStmt = req.database
            .prepare(`SELECT entry_id    as id,
                             player_name as name,
                             score       as score,
                             date        as timestamp
                      FROM entries
                      WHERE scoreboard_id = @id
                      ORDER BY score DESC
                      LIMIT @max`);
        const entries = entryStmt.all({
            id: scoreboardId,
            max: parseInt(maxEntries) || 10
        });

        // limited stats
        const statsLimitedStmt = req.database
            .prepare(`SELECT COUNT(*)   as timeScoreCount,
                             AVG(score) as timeScoreAverage
                      FROM entries
                      WHERE scoreboard_id = @id
                        AND date > @minTime`);
        const { timeScoreCount, timeScoreAverage } = statsLimitedStmt.get({
            id: scoreboardId,
            minTime: (new Date().getTime() / 1000) - ((parseInt(pastDays) || 7) * 60 * 60 * 24)
        });

        // all-time stats
        const statsAllStmt = req.database
            .prepare(`SELECT COUNT(*)   as allScoreCount,
                             AVG(score) as allScoreAverage
                      FROM entries
                      WHERE scoreboard_id = @id`);
        const { allScoreCount, allScoreAverage } = statsAllStmt.get({
            id: scoreboardId
        });

        // render results
        res.render('scoreboard', {
            details: {
                game: gameName,
                scoreboard: scoreboardName,
                setKey, getKey,
                embedEnabled, embedTitle
            },
            stats: {
                timeScoreAverage, timeScoreCount,
                allScoreAverage, allScoreCount
            },
            entries,
        });
    } else {
        res.send('404 scoreboard not found');
    }
});

// changes details about a scoreboard
r.post('/:scoreboardId', (req, res) => {
    const { scoreboardId } = req.params;
    const { newName, enableEmbed, resetApiKeys, clearEntries, deleteScore } = req.body;
});

// removes a scoreboard from the database
r.delete('/:scoreboardId', (req, res) => {
    const { scoreboardId } = req.params;

});

module.exports = r;
