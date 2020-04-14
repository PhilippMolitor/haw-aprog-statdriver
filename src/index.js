// imports
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
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
app.set('views', __dirname + '/templates');

// attach router
app.use('/', router);

app.listen(config.port, () => {
    console.info('server is listening on port ' + config.port);
});
