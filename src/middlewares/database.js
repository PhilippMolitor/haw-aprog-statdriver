// imports
const betterSqlite3 = require('better-sqlite3');
const path = require('path');
const config = require('../config');

// database file path
const databaseFile = path.join(config.dataPath, 'statdriver.db');

// instances
const database = betterSqlite3(databaseFile, {
    verbose: message => {
        if (!config.isProduction) console.debug('[debug] database query: ' + message);
    }
});

// middleware factory
function databaseMiddleware () {
    return (req, res, next) => {
        req.database = database;
        next();
    };
}

// export necessary parts as module object
module.exports = {
    database,
    databaseMiddleware
};
