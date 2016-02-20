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

// routes
app.use('/', baseRoutes);

// start server
const port = process.env.CLASS_PORT || 3000;

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
