// imports
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const path = require('path');
const morgan = require('morgan');
const config = require('./config');
const router = require('./router');

// instances
const app = express();

// add middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('tiny'));

// express settings
app.engine('ejs', ejs.__express);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/templates'));

// attach router
app.use('/', router);
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// run the server
app.listen(config.port, () => {
    console.info('server is listening on port ' + config.port);
});
