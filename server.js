const express = require('express');
const handlebars = require('express-handlebars');

const baseRoutes = require('./routes/base');

const app = express();
const i18n = require('i18n');

//transalting power is present here
i18n.configure({
  locales: ['en', 'es'],
  cookie: 'yourcookiename',
  directory: __dirname+'/locales'
});
app.use(i18n.init);

// use handlebars for templates
app.engine('.html', handlebars({defaultLayout: 'main', extname: '.html'}));
app.set('view engine', '.html');
app.use(express.static(__dirname + '/css'));


app.use((req, res, next) => {
    // dictionary of request global variables
    req.App = {};
    next();
});

app.use('/static', express.static('static'));

// routes
app.use('/', baseRoutes);

// start server
const port = process.env.CLASS_PORT || 3000;

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
