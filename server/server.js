



const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cryptoJS = require('crypto-js');
const request = require('request');
const redis = require('redis');
const _ = require('lodash');
var fs = require('fs');

const session = require('./server-middleware/session');
const translation = require('./server-middleware/translation');
const templates = require('./server-middleware/templates');
const apiMethods = require('./server-middleware/api').apiMethods;
const languageService = require('./server-middleware/language-service');
const routes = require('./routes/routes');
const consts = require('./utils/constants');
const react_consts = require('./utils/react_constants');
const app = express();

const redisClient = redis.createClient({
    host: consts.REDIS_HOST,
    port: consts.REDIS_PORT,
    password: consts.REDIS_AUTH
});


const multer = require('multer'); //TODO: we may need to limit the file upload size

var storage = multer({
    dest: './tempFiles/',
    limits: { //Max 3 files and total of 50MB
        fileSize: consts.FILE_SIZE,
        files: consts.MAX_NUM_FILES
    }
});

app.use('/static', express.static(`${__dirname}/static`));
app.use('/service-worker.js', express.static(`${__dirname}/service-worker.js`)
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(session(redisClient));
var upload = multer({
    dest: './files'
});
app.use((req, res, next) => {
    req.App = {};

    req.App.api = apiMethods;

    next();
});

app.get('/api/generalCall', (req, res) => {
    let queryStrings = req.query;
    let endpoint = `${req.query.endpoint}`;
    delete queryStrings.endpoint;

    req.App.api.get(endpoint, queryStrings, (err, statusCode, body) => {
        res.status(statusCode).json(body);
        res.end();

    });
});

app.post('/api/generalCall', (req, res) => {
    let postVars = req.body;
    let endpoint = `${req.body.endpoint}`;
    delete postVars.endpoint;

    req.App.api.post(endpoint, postVars, (err, statusCode, body) => {
        res.status(statusCode).json(body);
        res.end();

    });
});

app.post('/api/file/upload', upload.array('files'), (req, res) => {
    let postVars = req.body;
    let endpoint = `${req.body.endpoint}`;
    delete postVars.endpoint;
    const formData = new FormData();
    req.files.forEach(file => {
        console.log(file);
        formData.append('files', fs.createReadStream(file.path));
        //
        //{
        //     value:  fs.createReadStream(file.path),
        //     options: {
        //         filename: file.originalname,
        //         contentType: file.mimetype
        //     }
        // }
    });
    Object.keys(postVars).forEach(function(key){
        formData.append(`${key}`, postVars[key]);
    });

    var xhr = new XMLHttpRequest();
    xhr.open( 'POST', `${consts.API_URL}/api/upload/profile-picture`, true);
    xhr.onreadystatechange = function(){
        if(this.readyState == 4) {
            if(this.status == 200){
                console.log('Success', this.responseText);

            }
            else{
                console.log('Sorry, there was an error', this.responseText);
            }
        }
        else{
            console.log('Uploading...');
        }

    };
    xhr.send(formData);
});

app.get('/api/getTranslatedString', (req, res) => {
    let locale = 'en';

    if ('lang' in req.query) {
        locale = req.query.lang;
    }

    if ('lang' in req.session) {
        locale = req.session.lang;
    }

    translation(redisClient).setupTranslations(locale, translateFunc => {
        let translated = translateFunc(req.query.string);
        res.json({
            lang: translated
        });
        res.end();
    });
});

app.post('/api/getTranslatedString', (req, res) => {
    let locale = 'en';

    if ('lang' in req.query) {
        locale = req.query.lang;
    }

    if ('lang' in req.session) {
        locale = req.session.lang;
    }

    translation(redisClient).setupTranslations(locale, translateFunc => {
        let language = req.body.string;
        Object.keys(language).map(key => {
            language[key] = translateFunc(language[key]);
        });

        res.json(language);
        res.end();
    });
});

app.get('/api/translations', (req, res) => {
    languageService(redisClient).getAllStringsInLanguage(
        req.query.lang ? req.query.lang : 'en',
        (err, results) => {
            res.json(results);

            res.end();
        }
    );
});

app.post('/api/translations', (req, res) => {
    if (!(language in req.body)) {
        res.status(400).end();
    }

    const language = req.body.language;

    for (let str in req.body.strs) {
        languageService(redisClient).addTranslation(
            language,
            str,
            req.body.strs[str]
        );
    }

    res.status(200).end();
});


app.post('/api/change-admin-status', (req, res) => {
    const userId = req.body.userId;
    const makeAdmin = req.body.makeAdmin;

    if (!makeAdmin) {
        console.log('not make admin');
        return res.status(500).end();
    }

    req.App.api.put(
        '/makeUserAdmin/',
        {
            UserID: userId
        },
        (err, statusCode, body) => {
            res.status(statusCode).end();
        }
    );
});

// set the language cookie if it has a lang query param
app.use((req, res, next) => {
    // language options
    const languages = react_consts.LANGUAGES;
    // default language
    res.locale = 'en';

    if(req.headers['accept-language']){
        //set language to user's browser configuration
        let locales = languages.map(lang => lang.locale);
        let browserLangs = req.headers['accept-language'].match(/[a-z]{2}/g);
        for(let idx = 0; idx < browserLangs.length; idx +=1){
            if(browserLangs[idx] in locales){
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

    for (const lang of languages) {
        if (lang.locale === res.locale) {
            req.App.lang = lang.language;
        } else {
            req.App.langOptions.push(lang);
        }
    }

    next();
});

var __;


app.use((req, res, next) => {
    translation(redisClient).setupTranslations(res.locale, translateFunc => {
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
    if('token' in req.session){
        req.App.user.token = req.session.token;
    }

    next();
});

app.use((req, res, next) => {
    if (req.App.user && req.App.user.userId) {
        return req.App.api.get(`/generalUser/${req.App.user.userId}`,(err, statusCode, body) => {

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

            const user = body.User; // JV - grabbed user's information
            req.App.user.email = user.UserLogin.Email;
            req.App.user.firstName = user.FirstName;
            req.App.user.lastName = user.LastName;
            req.App.user.type = user.Instructor ? 'teacher' : 'student';
            req.App.user.admin = user.Admin;
            next();
        }
        );
    }

    next();
});

app.use((req, res, next) => {
    const render = res.render;

    res.render = function(template, options, cb) {
        options = options ? options : {};

        options.template = template;
        options.user = req.App.user;
        
        if (!('showHeader' in options)) {
            options.showHeader = true;
        }

        options.language = req.App.lang;
        options.languageOptions = req.App.langOptions;
        

        if (options.loggedOut) {
            options.layout = 'logged_out';

            return render.call(this, template, options, cb);
        }
        if (req.App.user && !options[req.App.user.type]) {
            if (req.App.user.admin && options.admin) {
            } else {
                return res.sendStatus(404);
            }
        }
        options.showMasqueradingOption = req.App.user.admin
            ? req.App.user.admin
            : false; //new value, not working yet

        var sidebarNavItems = [];

        for (const route in routes) {
            var currentRoute = _.clone(routes[route]);
            if (!currentRoute.sidebar) {
                continue;
            }

            if (currentRoute.route.includes(options.route)) {
                currentRoute.selected = true;
            } else {
                currentRoute.selected = false;
            }

            currentRoute.title = __(currentRoute.title);

            if(req.App.user.admin === true){
                if (currentRoute.access.admins) {
                    sidebarNavItems.push(currentRoute);
                } else {
                    continue;
                }
            }
            else if (req.App.user.type === 'student') {
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
app.use(function(req, res, next) {
    const allowedRouteMethods = [
        'get',
        'post',
        'put',
        'head',
        'delete',
        'options',
        'trace',
        'copy',
        'lock',
        'mkcol',
        'move',
        'purge',
        'propfind',
        'proppatch',
        'unlock',
        'report',
        'mkactivity',
        'checkout',
        'merge',
        'm-search',
        'notify',
        'subscribe',
        'unsubscribe',
        'patch',
        'search',
        'connect'
    ];
    for (const route of routes) {
        for (const method in route.routeHandler) {
            // if the method is allowed then bind the route to it
            if (allowedRouteMethods.indexOf(method) !== -1) {
                app[method](
                    route.route,
                    (function() {
                        return (req, res, next) => {
                            const previousRender = res.render;
                            res.render = (function() {
                                return function(template, options, cb) {
                                    options = options ? options : {};
                                    options.loggedOut = route.access.loggedOut;
                                    options.route = route.route;
                                    options.student = route.access.students;
                                    options.teacher = route.access.instructors;
                                    options.admin = route.access.admins;
                                    options.username = req.App.user.firstName + req.App.user.lastName;
                                    // if the render doesn't set the title then set it by the route
                                    if (!('title' in options)) {
                                        options.title = `${route.title} | CLASS Learning System`;
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

                                    previousRender.call(
                                        this,
                                        template,
                                        options,
                                        cb
                                    );
                                };
                            })();
                            next();
                        };
                    })(),
                    route.routeHandler[method]
                );
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
