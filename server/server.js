const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cryptoJS = require('crypto-js');
const request = require('request');
const redis = require('redis');
const _ = require('lodash');

const session = require('./server-middleware/session');
const translation = require('./server-middleware/translation');
const templates = require('./server-middleware/templates');
const apiMethods = require('./server-middleware/api').apiMethods;
const languageService = require('./server-middleware/language-service');
const routes = require('./routes/routes');

const consts = require('./utils/constants');

const app = express();

const redisClient = redis.createClient({
    host: consts.REDIS_HOST,
    port: consts.REDIS_PORT,
    password: consts.REDIS_AUTH
});

app.use('/static', express.static(`${__dirname}/static`));

app.use(cookieParser());
app.use(bodyParser());

app.use(session(redisClient));

app.use((req, res, next) => {
    req.App = {};

    req.App.api = apiMethods;

    next();
});

app.get('/api/translations', (req, res) => {
    languageService(redisClient).getAllStringsInLanguage(req.query.lang ? req.query.lang : 'en', (err, results) => {
        res.json(results);

        res.end();
    });
});

app.post('/api/translations', (req, res) => {
    if (!(language in req.body)) {
        res.status(400).end();
    }

    const language = req.body.language;

    for (let str in req.body.strs) {
        languageService(redisClient).addTranslation(language, str, req.body.strs[str]);
    }

    res.status(200).end()
});

// set the language cookie if it has a lang query param
app.use((req, res, next) => {
    res.locale = 'en';

    if ('lang' in req.query) {
        req.session.lang = req.query.lang;
        res.locale = req.query.lang;
    }

    if ('lang' in req.session) {
        res.locale = req.session.lang
    }

    const languages = [
        {language: 'English', locale: 'en'},
        {language: 'Español', locale: 'es'},
        {language: 'Français', locale: 'fr'}
    ];

    req.App.langOptions = [];

    for (const lang of languages) {
        if (lang.locale === res.locale) {
            req.App.lang = lang.language;
        }
        else {
            req.App.langOptions.push(lang);
        }
    }

    next();
});

var __;

app.use((req, res, next) => {
    translation(redisClient).setupTranslations(res.locale, (translateFunc) => {
        __ = translateFunc;

        app.set('views', `${__dirname}/views/`);
        app.engine('.html', templates.setup(__).engine);
        app.set('view engine', '.html');

        next();
    });
});

app.use((req, res, next) => {
    if ('userId' in req.session) {
        req.App.user = {};
        req.App.user.userId = req.session.userId;
    }
    next();
});

app.use((req, res, next) => {
    if (req.App.user && req.App.user.userId) {
        return req.App.api.get(`/generalUser/${req.App.user.userId}`, (err, statusCode, body) => {
            if (err || statusCode !== 200) {
                delete req.session.userId;
                res.redirect('/');
            }

            const user = body.User[0];
            req.App.user.email = user.Email;
            req.App.user.firstName = user.FirstName;
            req.App.user.lastName = user.LastName;
            req.App.user.type = user.UserType === 'Student' ? 'student' : 'teacher';

            next();
        });
    }

    next();
});

app.use((req, res, next) => {
    const render = res.render;

    res.render = function(template, options, cb) {
		options.template = template;

        if (!('showHeader' in options)) {
            options.showHeader = true;
        }

        options.language = req.App.lang;
        options.languageOptions = req.App.langOptions;
        options.apiUrl = consts.API_URL;

        if (options.loggedOut) {
            options.layout = 'logged_out';

            return render.call(this, template, options, cb);
        }

        if (req.App.user && req.App.user.type === 'student' && !options.studentAccessible) {
            return res.sendStatus(404);
        }

        var sidebarNavItems = [];

        for (const route in routes) {
            var currentRoute = _.clone(routes[route]);
            if (!currentRoute.sidebar) {
                continue;
            }

            if (currentRoute.route === options.route) {
                currentRoute.selected = true;
            }
            else {
                currentRoute.selected = false;
            }

            currentRoute.title = __(currentRoute.title);

            if (req.App.user.type === 'student') {
                if (currentRoute.access.students) {
                    sidebarNavItems.push(currentRoute);
                }
                else {
                    continue;
                }
            }
            else {
                sidebarNavItems.push(currentRoute);
            }
        }

        options.sidebarNavItems = sidebarNavItems;

        // only allow logged out users access to pages that are meant for logged out users
        if (!req.App.user || !req.App.user.userId) {
            return res.sendStatus(404);
        }

        render.call(this, template, options, cb);
    };

    next();
});

// routes
app.use(function(req, res, next) {
    const allowedRouteMethods = ['get', 'post', 'put', 'head', 'delete', 'options', 'trace', 'copy', 'lock', 'mkcol', 'move', 'purge', 'propfind', 'proppatch', 'unlock', 'report', 'mkactivity', 'checkout', 'merge', 'm-search', 'notify', 'subscribe', 'unsubscribe', 'patch', 'search', 'connect'];
    for (const route of routes) {
        for (const method in route.routeHandler) {
            // if the method is allowed then bind the route to it
            if (allowedRouteMethods.indexOf(method) !== -1) {
                app[method](route.route, function() { return (req, res, next) => {
                    const previousRender = res.render;
                    res.render = function() {
                        return function(template, options, cb) {
                            options.loggedOut = route.access.loggedOut;
                            options.route = route.route;
                            options.studentAccessible = route.access.students;
                            previousRender.call(this, template, options, cb);
                        };
                    }();
                    next();
                } }(), route.routeHandler[method]);
            }
        }
    }
    next();
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(404).render('not_found', {
        title: 'Not Found'
    });
});

app.listen(consts.FRONTEND_PORT, () => {
    console.log(`Server running at http://localhost:${consts.FRONTEND_PORT}`);
});
