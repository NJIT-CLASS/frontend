const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cryptoJS = require('crypto-js');
const request = require('request');
const redis = require('redis');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const mv = require('mv');
const session = require('./server-middleware/session');
const translation = require('./server-middleware/translation');
const templates = require('./server-middleware/templates');
const apiMethods = require('./server-middleware/api').apiMethods;
const languageService = require('./server-middleware/language-service');
const routes = require('./routes/routes');
const consts = require('./utils/constants');
const react_consts = require('./utils/react_constants');
import {uploadFile} from './server-middleware/file-upload';

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

app.use((req, res, next) => {
    req.App = {};

    req.App.api = apiMethods;

    next();
});


/*
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
});*/

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

app.delete('/api/generalCall', (req, res) => {
    let postVars = req.body;
    let endpoint = `${req.body.endpoint}`;
    delete postVars.endpoint;

    req.App.api.delete(endpoint, postVars, (err, statusCode, body) => {
        res.status(statusCode).json(body);
        res.end();

    });
});

app.put('/api/generalCall', (req, res) => {
    let postVars = req.body;
    let endpoint = `${req.body.endpoint}`;
    delete postVars.endpoint;

    req.App.api.put(endpoint, postVars, (err, statusCode, body) => {
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

app.post('/api/file/upload/:type?', storage.array('files'), (req, res) => {
    let postVars = req.body;
    let endpoint = `${req.body.endpoint}`;
    //maybe check for authorization before continuing
    let type = req.params.type || '';
    delete postVars.endpoint;
    const listOfErrors = [];
    const uploadStatus = {
        successfulFiles: [],
        failedFiles: []
    };
    let filesToUpload = req.files.map( file =>
        uploadFile(file, type, req.App.user.userId, postVars));
    
    return Promise.all(filesToUpload).then(resultsArray => {
        uploadStatus.successfulFiles = resultsArray.filter(file => file.FileID !== undefined);
        uploadStatus.failedFiles = resultsArray.filter(file => file.FileID === undefined);
        if(uploadStatus.failedFiles.length == 0){
            return res.status(200).json(uploadStatus);
        } else {
            return res.status(400).json(uploadStatus);
            
        }
    });
});

app.get('/api/file/download/:fileId', function(req, res) {
    // router.post('/download/file/:fileId', function (req, res) {
    // router.get('/download/file', function (req, res) {
    
    var file_id = req.body.fileId || req.params.fileId;
    
    if (file_id == null) {
        return res.status(400).end();
    }

    request({
        uri: `${react_consts.API_URL}/api/file/download/${file_id}`,
        method: 'GET',
        json: true
    }, (err,response,body) => {
        var file_ref = body;

        if (!file_ref) {
            return res.status(400).end();
        }
        file_ref = JSON.parse(file_ref.Info);
        console.log(file_ref);
        let contDispFirstHalf = file_ref.mimetype.match('image') ? 'inline' : 'attachment';
        let contDispSecondHalf = file_ref.originalname;
        var content_headers = {
            'Content-Type': file_ref.mimetype,
            'Content-Length': file_ref.size,
            'Content-Disposition': `${contDispFirstHalf};filename=${contDispSecondHalf}`,
        };
        res.writeHead(200, content_headers);
        const readStream = fs.createReadStream(`${consts.UPLOAD_DIRECTORY_PATH}/${file_ref.filename}`);
        console.log('path', `${consts.UPLOAD_DIRECTORY_PATH}/${file_ref.filename}`);
        readStream.on('open', () => {
            readStream.pipe(res);
        });
        readStream.on('error', (err) => {
            console.error(err);
            res.status(400).end();
        });
    });
});


app.delete('/api/file/delete/', function(req,res){
    //probably verify authorization and owner first
    var file_id = req.body.fileId;
    var postVars = req.body;
    postVars.userId = req.App.user.userId;
    if(!file_id){
        return res.status(400).end();
    }
    
    request({
        uri: `${react_consts.API_URL}/api/file/delete/${file_id}`,
        method: 'DELETE',
        json: true,
        body: postVars
    }, (err,response,body) => {
        var file_ref = body.Info;
        let filePath = `${consts.UPLOAD_DIRECTORY_PATH}/${file_ref.filename}`;
        fs.unlink(filePath, (err)=> {
            if(err){
                console.error(err);
                return res.status(400).end();
            } 
            return res.status(200).end();
            
        });
    });
});
/**
    ***** 
 **********/


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
            } else if (
                req.App.user.type == 'teacher' &&
				req.App.user.admin == 0
            ) {
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
