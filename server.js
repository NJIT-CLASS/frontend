const express = require('express');
const handlebars = require('express-handlebars');
const mysql = require('mysql');

const translator = require('./translate/translate');

const baseRoutes = require('./routes/base');

const app = express();

// use handlebars for templates
app.engine('.html', handlebars({defaultLayout: 'main', extname: '.html'}));
app.set('view engine', '.html');

app.use((req, res, next) => {
    // dictionary of request global variables
    req.App = {};
    next();
});

// setup MySQL
app.use((req, res, next) => {
    const connection = mysql.createConnection({
        host     : process.env.CLASS_DB_HOST,
        user     : process.env.CLASS_DB_USER,
        password : process.env.CLASS_DB_PASSWORD,
        database : process.env.CLASS_DB_DATABASE
    });

    connection.connect();

    req.App.mysql = connection;

    req.App.Translate = translator(req.App.mysql, 'english');

    // end connection once the res
    res.on('finish', ((req) => () => {
        return req.App.mysql.end();
    })(req));

    next();
});

// routes
app.use('/', baseRoutes);

// start server
const port = process.env.CLASS_PORT || 3000;

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
