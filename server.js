const express = require('express');
const handlebars = require('express-handlebars');
const cookieParser = require('cookie-parser');
const cryptoJS = require('crypto-js');

const consts = require('./utils/constants');
const baseRoutes = require('./routes/base');

const app = express();
const i18n = require('i18n');

//transalting power is present here
i18n.configure({
    locales: ['en', 'es','fr'],
    defaultLocale: 'en',
    cookie: 'lang',
    directory: __dirname+'/locales'
});

app.use(cookieParser());

app.use(i18n.init);

var hbs = handlebars.create({
    defaultLayout: 'main',
    extname: '.html',
    // Specify helpers which are only registered on this instance.
    helpers: {
        __: function () {
            return i18n.__.apply(this, arguments);
        }
    }
});

// use handlebars for templates
app.engine('.html', hbs.engine);
app.set('view engine', '.html');

app.use((req, res, next) => {
    // dictionary of request global variables
    req.App = {};
    next();
});

// set the language cookie if it has a lang query param
app.use((req, res, next) => {
    if ('lang' in req.query) {
        res.cookie('lang', req.query.lang);
        i18n.setLocale(res, req.query.lang);
    }

    if (res.locale === 'en') {
        req.App.lang = 'English';
    }
    else if (res.locale === 'es') {
        req.App.lang = 'Español';
    }
    else if (res.locale === 'fr') {
        req.App.lang = 'Français';
    }

    next();
});

app.use((req, res, next) => {
    if ('user' in req.cookies) {
        const decryptedUserBytes = cryptoJS.AES.decrypt(req.cookies.user, consts.USER_SECRET);
        req.App.userId = decryptedUserBytes.toString(cryptoJS.enc.Utf8);
    }
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
