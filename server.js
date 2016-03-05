const express = require('express');
const handlebars = require('express-handlebars');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cryptoJS = require('crypto-js');
const request = require('request');

const consts = require('./utils/constants');
const baseRoutes = require('./routes/base');

const app = express();
const i18n = require('i18n');

//translating power is present here
i18n.configure({
    locales: ['en', 'es','fr'],
    defaultLocale: 'en',
    cookie: 'lang',
    directory: `${__dirname}/locales`
});

app.use('/static', express.static(`${__dirname}/static`));

app.use(cookieParser());
app.use(bodyParser());

app.use(i18n.init);

app.set('views', `${__dirname}/views/`);

var hbs = handlebars.create({
    layoutsDir: `${__dirname}/views/layouts/`,
    partialsDir: `${__dirname}/views/`,
    defaultLayout: 'logged_in',
    extname: '.html',
    // Specify helpers which are only registered on this instance.
    helpers: {
        __: function () {
            return i18n.__.apply(this, arguments);
        }, 
		
		sidebarHighlighter: function(template, sidebarItem, options){
		if (template === sidebarItem){
			return options.fn(this);
			
			
		}
		
			
		}
		
    }
});

// use handlebars for templates
app.engine('.html', hbs.engine);
app.set('view engine', '.html');

app.use((req, res, next) => {
    // dictionary of request global variables
    req.App = {};

    req.App.api ={
        get: function(endpoint, queryParameters, cb) {
            if (arguments.length === 2) {
                var cb = queryParameters;
                queryParameters = {};
            }

            const options = {
                method: 'GET',
                uri: `http://162.243.45.215:8080/api${endpoint}`,
                qs: queryParameters,
                json: true
            };

            request(options, function(err, response, body) {
                return cb(err, response.statusCode, body);
            });
        },
        post: function(endpoint, body, cb) {
            if (arguments.length === 2) {
                var cb = body;
                body = {};
            }

            const options = {
                method: 'POST',
                uri: `http://162.243.45.215:8080/api${endpoint}`,
                json: true,
                body: body
            };

            request(options, function(err, response, body) {
                return cb(err, response.statusCode, body);
            });
        },
        put: function(endpoint, body, cb) {
            if (arguments.length === 2) {
                var cb = body;
                body = {};
            }

            const options = {
                method: 'PUT',
                uri: `http://162.243.45.215:8080/api${endpoint}`,
                json: true,
                body: body
            };

            request(options, function(err, response, body) {
                return cb(err, response.statusCode, body);
            });
        }
    };

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
        req.App.user = {};
        const decryptedUserBytes = cryptoJS.AES.decrypt(req.cookies.user, consts.USER_SECRET);
        req.App.user.userId = parseInt(decryptedUserBytes.toString(cryptoJS.enc.Utf8));
    }
    next();
});

app.use((req, res, next) => {
    const render = res.render;

    res.render = function(template, options, cb) {
		options.template=template;
        const loggedOutTemplates = {
            password_reset: true,
            home: true,
            create_account: true
        };

        if (template in loggedOutTemplates) {
            options.layout = 'logged_out';
            options.language = req.App.lang;

            return render.call(this, template, options, cb);
        }

        // only allow logged out users access to pages that are meant for logged out users
        if (!req.App.user || !req.App.user.userId) {
            return res.sendStatus(404);
        }

        render.call(this, template, options, cb);
    };

    next();
});

app.use((req, res, next) => {
    if (req.App.user && req.App.user.userId) {
        return req.App.api.get(`/generalUser/${req.App.user.userId}`, (err, statusCode, body) => {
            if (err || statusCode !== 200) {
                res.clearCookie('user');
                res.redirect('/');
            }

            const user = body.User[0];
            req.App.user.email = user.EmailAddress;
            req.App.user.firstName = user.FirstName;
            req.App.user.lastName = user.LastName;
            req.App.user.type = user.UserType;

            next();
        });
    }

    next();
});

// routes
app.use('/', baseRoutes);

app.listen(consts.FRONTEND_PORT, () => {
    console.log(`Server running at http://localhost:${consts.FRONTEND_PORT}`);
});
