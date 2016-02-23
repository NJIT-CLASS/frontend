const express = require('express');
const handlebars = require('express-handlebars');
const cookieParser = require('cookie-parser');
const cryptoJS = require("crypto-js");

const consts = require('./utils/constants');
const baseRoutes = require('./routes/base');

const app = express();

app.use(cookieParser());

// use handlebars for templates
app.engine('.html', handlebars({defaultLayout: 'main', extname: '.html'}));
app.set('view engine', '.html');

app.use((req, res, next) => {
    // dictionary of request global variables
    req.App = {};
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
