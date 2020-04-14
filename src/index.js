// imports
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const config = require('./config');
const router = require('./router');

// instances
const app = express();

// add middlewares
app.use(bodyParser.urlencoded({ extended: true }));

// express settings
app.engine('ejs', ejs.__express);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/templates');

// attach router
app.use('/', router);

app.listen(config.port, () => {
    console.log('server is listening on port ' + config.port);
});
