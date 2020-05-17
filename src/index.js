// imports
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const path = require('path');
const morgan = require('morgan');
const expressSession = require('express-session');
const config = require('./config');
const router = require('./router');
const { databaseMiddleware } = require('./middlewares/database');
const { authenticationMiddleware } = require('./middlewares/authentication');
const { runDatabaseSeeder, checkDatabasePresent } = require('./seeder');

// instances
const app = express();

// seed database if not present
if (!checkDatabasePresent()) {
    console.warn('database not seeded, running seeder...');
    runDatabaseSeeder();
}

// express settings
app.engine('ejs', ejs.__express);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/templates'));

// add middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// noinspection JSCheckFunctionSignatures
app.use(morgan('tiny'));
// noinspection JSCheckFunctionSignatures
app.use(expressSession({
    name: 'statdriver-login',
    secret: config.cookieSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: config.isProduction,
        sameSite: config.isProduction ? true : 'none',
    },
    proxy: config.isProduction,
}));

// add custom middlewares
app.use(databaseMiddleware());
app.use(authenticationMiddleware());

// attach router
app.use('/', router);
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/mockui', express.static(path.join(__dirname, 'mockui', 'build')));

// run the server
app.listen(config.port, () => {
    console.debug('application environment: ' + (config.isProduction ? '' : 'not ') + 'production');
    console.info('server is listening on port ' + config.port);
});
