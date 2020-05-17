const r = require('express').Router();
const { randomKey } = require('../tools');

// shows a scoreboard
r.get('/:scoreboardId', (req, res) => {
    const { scoreboardId } = req.params;
    const { maxEntries, pastDays, scoreNameFilter } = req.query;

    // check for scoreboard ownership
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
            owner: req.authentication.getUserId(),
        });

    if (result) {
        const { scoreboardName, gameId, setKey, getKey, embedEnabled, embedTitle } = result;
        const pastDaysParsed = parseInt(pastDays) || 7;

        // game name
        const gameStmt = req.database
            .prepare(`SELECT name as gameName
                      FROM games
                      WHERE game_id = @id`);
        const { gameName } = gameStmt
            .get({
                id: gameId,
            });

        // entries
        const entryStmt = req.database
            .prepare(`SELECT entry_id    as id,
                             player_name as name,
                             score       as score,
                             date        as timestamp
                      FROM entries
                      WHERE scoreboard_id = @id
                        AND player_name LIKE ('%' || @scoreNameFilter || '%')
                      ORDER BY score DESC
                      LIMIT @max`);
        const entries = entryStmt.all({
            id: scoreboardId,
            max: parseInt(maxEntries) || 10,
            scoreNameFilter: scoreNameFilter || '',
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
            minTime: (new Date().getTime() / 1000) - (pastDaysParsed * 60 * 60 * 24),
        });

        // all-time stats
        const statsAllStmt = req.database
            .prepare(`SELECT COUNT(*)   as allScoreCount,
                             AVG(score) as allScoreAverage
                      FROM entries
                      WHERE scoreboard_id = @id`);
        const { allScoreCount, allScoreAverage } = statsAllStmt.get({
            id: scoreboardId,
        });

        // render results
        res.render('scoreboard', {
            details: {
                game: gameName,
                scoreboard: scoreboardName,
                setKey, getKey,
                embedEnabled, embedTitle,
                pastDaysParsed, scoreNameFilter,
            },
            stats: {
                timeScoreAverage, timeScoreCount,
                allScoreAverage, allScoreCount,
            },
            entries,
        });
    } else {
        res.render('404');
    }
});

// changes details about a scoreboard
r.post('/:scoreboardId', (req, res) => {
    const { scoreboardId } = req.params;
    const { newName, enableEmbed, embedTitle, resetApiKeys, clearEntries, deleteEntry } = req.body;

    // check for scoreboard ownership
    const stmt = req.database
        .prepare(`SELECT s.name
                  FROM scoreboards s
                           INNER JOIN games g ON
                      s.game_id = g.game_id
                  WHERE scoreboard_id = @id
                    AND g.owner_id = @owner`);
    const result = stmt
        .get({
            id: scoreboardId,
            owner: req.authentication.getUserId(),
        });

    if (result) {
        // update scoreboard values
        if (newName || embedTitle || enableEmbed) {
            const stmt = req.database
                .prepare(`UPDATE scoreboards
                          SET name          = coalesce(@newName, name),
                              embed_title   = coalesce(@embedTitle, embed_title),
                              embed_enabled = coalesce(@enableEmbed, embed_enabled)
                          WHERE scoreboard_id = @id`);
            stmt.run({
                newName,
                embedTitle,
                enableEmbed: enableEmbed ? 1 : 0,
                id: scoreboardId,
            });
        }

        // reset the get and set API keys
        if (resetApiKeys) {
            const stmt = req.database
                .prepare(`UPDATE scoreboards
                          SET get_key = @getKey,
                              set_key = @setKey
                          WHERE scoreboard_id = @id`);
            stmt.run({
                getKey: randomKey(16),
                setKey: randomKey(16),
                id: scoreboardId,
            });
        }

        // reset the scoreboard entries (truncate it)
        if (clearEntries) {
            const stmt = req.database
                .prepare(`DELETE
                          FROM entries
                          WHERE scoreboard_id = @id`);
            stmt.run({
                id: scoreboardId,
            });
        }

        // delete a single score entry
        if (deleteEntry) {
            const stmt = req.database
                .prepare(`DELETE
                          FROM entries
                          WHERE entry_id = @id`);
            stmt.run({
                id: parseInt(deleteEntry),
            });
        }

        res.redirect('/scoreboard/' + scoreboardId);
    } else {
        res.render('404');
    }
});

// removes a scoreboard from the database
r.delete('/:scoreboardId', (req, res) => {
    const { scoreboardId } = req.params;

    // check for scoreboard ownership
    const stmt = req.database
        .prepare(`SELECT g.game_id as gameId
                  FROM scoreboards s
                           INNER JOIN games g ON
                      s.game_id = g.game_id
                  WHERE scoreboard_id = @id
                    AND g.owner_id = @owner`);
    const result = stmt
        .get({
            id: scoreboardId,
            owner: req.authentication.getUserId(),
        });

    if (result) {
        const stmt = req.database
            .prepare(`DELETE
                      FROM scoreboards
                      WHERE scoreboard_id = @id`);
        stmt.run({
            id: scoreboardId,
        });

        // redirect to game page, as this scoreboard does not exist anymore
        res.redirect('/game/' + result.gameId);
    } else {
        res.render('404');
    }
});

// delete a scoreboard
r.delete('/:scoreboardId', (req, res) => {
    const { scoreboardId } = req.params;

    // check for scoreboard ownership
    const stmt = req.database
        .prepare(`SELECT s.game_id as gameId
                  FROM scoreboards s
                           INNER JOIN games g ON
                      s.game_id = g.game_id
                  WHERE scoreboard_id = @id
                    AND g.owner_id = @owner`);
    const result = stmt
        .get({
            id: scoreboardId,
            owner: req.authentication.getUserId(),
        });

    if (result) {
        const stmt = req.database
            .prepare(`DELETE
                      FROM scoreboards
                      WHERE scoreboard_id = @id`);
        stmt.run({
            id: scoreboardId,
        });

        res.redirect('/game/' + result.gameId);
    } else {
        res.render('404');
    }
});

module.exports = r;
