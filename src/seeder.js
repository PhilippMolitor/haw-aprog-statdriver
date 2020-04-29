// imports
const fs = require('fs');
const path = require('path');
const { database } = require('./middlewares/database');

// runs the database seeding process
function runDatabaseSeeder () {
    const seedData = fs.readFileSync(
        path.join(__dirname, 'database', 'statdriver.sql'),
        'utf-8');
    database.exec(seedData);
}

// checks whether or not the database is present
function checkDatabasePresent () {
    const stmt = database.prepare(
            `SELECT name FROM sqlite_master WHERE type='table' AND name='installed';`);
    return !!stmt.get();
}

module.exports = {
    runDatabaseSeeder,
    checkDatabasePresent
};
