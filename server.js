const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cryptoJS = require('crypto-js');
const request = require('request');

const session = require('./server-middleware/session');
const translation = require('./server-middleware/translation');
const templateConfig = require('./server-middleware/templates').config;
const apiMethods = require('./server-middleware/api').apiMethods;

const consts = require('./utils/constants');
const baseRoutes = require('./routes/base');

const app = express();

app.use('/static', express.static(`${__dirname}/static`));

app.use(cookieParser());
app.use(bodyParser());

app.use(session);

app.use(translation.middleware);
const __ = translation.translate;
const setTranslationLocale = translation.setTranslationLocale;

app.set('views', `${__dirname}/views/`);
app.engine('.html', templateConfig.engine);
app.set('view engine', '.html');

app.use((req, res, next) => {
    req.App = {};

    req.App.api = apiMethods;

    next();
});

// set the language cookie if it has a lang query param
app.use((req, res, next) => {
    if ('lang' in req.query) {
        req.session.lang = req.query.lang;
        setTranslationLocale(res, req.query.lang);
    }

    if ('lang' in req.session) {
        setTranslationLocale(req.session.lang);
        setTranslationLocale([req, res, res.locals], req.session.lang);
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
            req.App.user.email = user.EmailAddress;
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
