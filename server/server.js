const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cryptoJS = require('crypto-js');
const request = require('request');
const redis = require('redis');

const session = require('./server-middleware/session');
const translation = require('./server-middleware/translation');
const templates = require('./server-middleware/templates');
const apiMethods = require('./server-middleware/api').apiMethods;
const languageService = require('./server-middleware/language-service');

const consts = require('./utils/constants');
const baseRoutes = require('./routes/base');

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

    if (res.locale === 'en') {
        req.App.lang = 'English';
        req.App.langOptions = [{
            language: 'Español',
            locale: 'es'
        },
        {
            language: 'Français',
            locale: 'fr'
        }];
    }
    else if (res.locale === 'es') {
        req.App.lang = 'Español';
        req.App.langOptions = [{
            language: 'English',
            locale: 'en'
        },
        {
            language: 'Français',
            locale: 'fr'
        }];
    }
    else if (res.locale === 'fr') {
        req.App.lang = 'Français';
        req.App.langOptions = [{
            language: 'English',
            locale: 'en'
        },
        {
            language: 'Español',
            locale: 'es'
        }];
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
            req.App.user.type = user.UserType;

            next();
        });
    }

    next();
});

app.use((req, res, next) => {
    const render = res.render;

    const sidebarNavItems = [
        {
            text: __('Dashboard'),
            link: '/dashboard',
            template: 'dashboard',
            onlyInstructors: false,
            icon: 'dashboard'
        },
        {
            text: __('Create Course'),
            link: '/create-course',
            template: 'create_course',
            onlyInstructors: true,
            icon: 'plus'
        },
        {
            text: __('Create Assignment'),
            link: '/create-assignment',
            template: 'create_assignment',
            onlyInstructors: true,
            icon: 'file-text'
        },
        {
            text: __('My Account'),
            link: '/accountmanagement',
            template: 'account_management',
            onlyInstructors: false,
            icon: 'cog'
        },
        {
            text: __('Administrator'),
            link: '/admin',
            template: 'admin',
            onlyInstructors: true,
            icon: 'user'
        },
        {
            text: __('Translation Manager'),
            link: '/translation-manager',
            template: 'translation_management',
            onlyInstructors: true,
            icon: 'globe'
        },
        {
            text: __('About'),
            link: '/about',
            template: 'about',
            onlyInstructors: false,
            icon: 'files-o'
        }
    ];

    res.render = function(template, options, cb) {
		options.template = template;

        if (!('showHeader' in options)) {
            options.showHeader = true;
        }

        const loggedOutTemplates = {
            password_reset: true,
            home: true,
            create_account: true,
            not_found: true
        };

        const studentTemplates = {
            dashboard: true,
            account_management: true,
            about: true
        };

        options.language = req.App.lang;
        options.languageOptions = req.App.langOptions;
        options.apiUrl = consts.API_URL;

        if (template in loggedOutTemplates) {
            options.layout = 'logged_out';

            return render.call(this, template, options, cb);
        }

        if (req.App.user && req.App.user.type === 'student' && !(template in studentTemplates)) {
            return res.sendStatus(404);
        }

        sidebarNavItems.forEach((sidebarItem, index) => {
            if (sidebarItem.onlyInstructors) {
                sidebarItem.showInNav = req.App.user.type === 'student' ? false : true;
            }
            else {
                sidebarItem.showInNav = true;
            }

            sidebarNavItems[index] = sidebarItem;
        });

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
app.use('/', baseRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(404).render('not_found', {
        title: 'Not Found'
    });
});

app.listen(consts.FRONTEND_PORT, () => {
    console.log(`Server running at http://localhost:${consts.FRONTEND_PORT}`);
});
