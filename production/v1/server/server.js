'use strict';

var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cryptoJS = require('crypto-js');
var request = require('request');
var redis = require('redis');
var _ = require('lodash');

var session = require('./server-middleware/session');
var translation = require('./server-middleware/translation');
var templates = require('./server-middleware/templates');
var apiMethods = require('./server-middleware/api').apiMethods;
var languageService = require('./server-middleware/language-service');
var routes = require('./routes/routes');

var consts = require('./utils/constants');
var react_consts = require('./utils/react_constants');
var app = express();

var redisClient = redis.createClient({
    host: consts.REDIS_HOST,
    port: consts.REDIS_PORT,
    password: consts.REDIS_AUTH
});

app.use('/static', express.static(__dirname + '/static'));
app.use('/service-worker.js', express.static(__dirname + '/service-worker.js'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(session(redisClient));

app.use(function (req, res, next) {
    req.App = {};

    req.App.api = apiMethods;

    next();
});

app.get('/api/getTranslatedString', function (req, res) {
    var locale = 'en';

    if ('lang' in req.query) {
        locale = req.query.lang;
    }

    if ('lang' in req.session) {
        locale = req.session.lang;
    }

    translation(redisClient).setupTranslations(locale, function (translateFunc) {
        var translated = translateFunc(req.query.string);
        res.json({
            lang: translated
        });
        res.end();
    });
});

app.post('/api/getTranslatedString', function (req, res) {
    var locale = 'en';

    if ('lang' in req.query) {
        locale = req.query.lang;
    }

    if ('lang' in req.session) {
        locale = req.session.lang;
    }

    translation(redisClient).setupTranslations(locale, function (translateFunc) {
        var language = req.body.string;
        Object.keys(language).map(function (key) {
            language[key] = translateFunc(language[key]);
        });

        res.json(language);
        res.end();
    });
});

app.get('/api/translations', function (req, res) {
    languageService(redisClient).getAllStringsInLanguage(req.query.lang ? req.query.lang : 'en', function (err, results) {
        res.json(results);

        res.end();
    });
});

app.post('/api/translations', function (req, res) {
    if (!(language in req.body)) {
        res.status(400).end();
    }

    var language = req.body.language;

    for (var str in req.body.strs) {
        languageService(redisClient).addTranslation(language, str, req.body.strs[str]);
    }

    res.status(200).end();
});

app.post('/api/change-admin-status', function (req, res) {
    var userId = req.body.userId;
    var makeAdmin = req.body.makeAdmin;

    if (!makeAdmin) {
        console.log('not make admin');
        return res.status(500).end();
    }

    req.App.api.put('/makeUserAdmin/', {
        UserID: userId
    }, function (err, statusCode, body) {
        res.status(statusCode).end();
    });
});

// set the language cookie if it has a lang query param
app.use(function (req, res, next) {
    // language options
    var languages = react_consts.LANGUAGES;
    // default language
    res.locale = 'en';

    if (req.headers['accept-language']) {
        //set language to user's browser configuration
        var locales = languages.map(function (lang) {
            return lang.locale;
        });
        var browserLangs = req.headers['accept-language'].match(/[a-z]{2}/g);
        for (var idx = 0; idx < browserLangs.length; idx += 1) {
            if (browserLangs[idx] in locales) {
                res.locale = browserLangs[idx];
            }
        }

        locales = null;
        browserLangs = null;
    }

    if ('lang' in req.query) {
        req.session.lang = req.query.lang;
        res.locale = req.query.lang;
    }

    if ('lang' in req.session) {
        res.locale = req.session.lang;
    }

    req.App.langOptions = [];

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = languages[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var lang = _step.value;

            if (lang.locale === res.locale) {
                req.App.lang = lang.language;
            } else {
                req.App.langOptions.push(lang);
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    next();
});

var __;

app.use(function (req, res, next) {
    translation(redisClient).setupTranslations(res.locale, function (translateFunc) {
        __ = translateFunc;

        app.set('views', __dirname + '/views/');
        app.engine('.html', templates.setup(__).engine);
        app.set('view engine', '.html');

        next();
    });
});

app.use(function (req, res, next) {
    if ('userId' in req.session) {
        req.App.user = {};
        req.App.user.userId = req.session.userId;
    }
    next();
});

app.use(function (req, res, next) {
    if ('token' in req.session) {
        req.App.user.token = req.session.token;
    }

    next();
});

app.use(function (req, res, next) {
    if (req.App.user && req.App.user.userId) {
        return req.App.api.get('/generalUser/' + req.App.user.userId, function (err, statusCode, body) {

            // if(statusCode === 500){
            //     delete req.session.userId;
            //     res.send('Sorry, the website is experiencing errors');
            //     return;
            // }

            if (err || statusCode !== 200) {
                delete req.session.userId;
                res.redirect('/');
                return;
            }

            if (body.User == undefined) {
                delete req.session.userId;
                res.send('Not Found').end();
                return;
            }

            var user = body.User; // JV - grabbed user's information
            req.App.user.email = user.UserLogin.Email;
            req.App.user.firstName = user.FirstName;
            req.App.user.lastName = user.LastName;
            req.App.user.type = user.Instructor ? 'teacher' : 'student';
            req.App.user.admin = user.Admin;

            next();
        });
    }

    next();
});

app.use(function (req, res, next) {
    var render = res.render;

    res.render = function (template, options, cb) {
        options = options ? options : {};

        options.template = template;

        if (!('showHeader' in options)) {
            options.showHeader = true;
        }

        options.language = req.App.lang;
        options.languageOptions = req.App.langOptions;
        options.apiUrl = react_consts.API_URL;

        if (options.loggedOut) {
            options.layout = 'logged_out';

            return render.call(this, template, options, cb);
        }
        if (req.App.user && !options[req.App.user.type]) {
            if (req.App.user.admin && options.admin) {} else {
                return res.sendStatus(404);
            }
        }
        options.showMasqueradingOption = req.App.user.admin ? req.App.user.admin : false; //new value, not working yet

        var sidebarNavItems = [];

        for (var route in routes) {
            var currentRoute = _.clone(routes[route]);
            if (!currentRoute.sidebar) {
                continue;
            }

            if (currentRoute.route === options.route) {
                currentRoute.selected = true;
            } else {
                currentRoute.selected = false;
            }

            currentRoute.title = __(currentRoute.title);

            if (req.App.user.type === 'student') {
                if (currentRoute.access.students) {
                    sidebarNavItems.push(currentRoute);
                } else {
                    continue;
                }
            } else if (req.App.user.type == 'teacher' && req.App.user.admin == 0) {
                if (currentRoute.access.instructors) {
                    sidebarNavItems.push(currentRoute);
                } else {
                    continue;
                }
            } else {
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
app.use(function (req, res, next) {
    var allowedRouteMethods = ['get', 'post', 'put', 'head', 'delete', 'options', 'trace', 'copy', 'lock', 'mkcol', 'move', 'purge', 'propfind', 'proppatch', 'unlock', 'report', 'mkactivity', 'checkout', 'merge', 'm-search', 'notify', 'subscribe', 'unsubscribe', 'patch', 'search', 'connect'];
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        var _loop = function _loop() {
            var route = _step2.value;

            for (var method in route.routeHandler) {
                // if the method is allowed then bind the route to it
                if (allowedRouteMethods.indexOf(method) !== -1) {
                    app[method](route.route, function () {
                        return function (req, res, next) {
                            var previousRender = res.render;
                            res.render = function () {
                                return function (template, options, cb) {
                                    options = options ? options : {};
                                    options.loggedOut = route.access.loggedOut;
                                    options.route = route.route;
                                    options.student = route.access.students;
                                    options.teacher = route.access.instructors;
                                    options.admin = route.access.admins;
                                    // if the render doesn't set the title then set it by the route
                                    if (!('title' in options)) {
                                        options.title = route.title + ' | CLASS Learning System';
                                    }

                                    // set the page header to be the route title if the pageHeader is not set
                                    if (!('pageHeader' in options)) {
                                        options.pageHeader = route.title;
                                    }

                                    // pass masquerading info to template
                                    if (req.session.masqueraderId && options.route !== '/') {
                                        options.masquerading = true;
                                        options.userEmail = req.App.user.email;
                                    }

                                    previousRender.call(this, template, options, cb);
                                };
                            }();
                            next();
                        };
                    }(), route.routeHandler[method]);
                }
            }
        };

        for (var _iterator2 = routes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            _loop();
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }

    next();
});

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(404).render('not_found', {
        title: 'Not Found'
    });
});

app.listen(consts.FRONTEND_PORT, function () {
    console.log('Server running at http://localhost:' + consts.FRONTEND_PORT);
});