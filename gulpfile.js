const gulp = require('gulp');
const sass = require('gulp-sass');
const nodemon = require('gulp-nodemon');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserify = require('browserify');
const watchify = require('watchify');
const babelify = require('babelify');
const babel = require('gulp-babel');
const gutil = require('gulp-util');
const uglify = require('gulp-uglify');
const flow = require('gulp-flowtype');
const inquirer = require('inquirer');
const fs = require('fs');
const argv = require('yargs').argv;
const install = require('gulp-install');
const del = require('del');
const runSequence = require('run-sequence');
const file = require('gulp-file');
const postcss      = require('gulp-postcss');
const autoprefixer = require('autoprefixer');


const compileReact = (rootFile, outputName, watch) => {
    const bundler = watchify(browserify(`./react${rootFile}`, { debug: true }).transform(babelify));

    function rebundle() {

        if(process.env.NODE_ENV === 'production'){
            bundler.bundle()
            .on('error', function(err) {
                gutil.log(err);
                gutil.beep();
                this.emit('end');
            })
            .pipe(source(`${outputName}.js`))
            .pipe(buffer())
            .pipe(uglify())
            .pipe(gulp.dest('./.build/static'));

        } else{

            bundler.bundle()
            .on('error', function(err) {
                gutil.log(err);
                gutil.beep();
                this.emit('end');
            })
            .pipe(source(`${outputName}.js`))
            .pipe(buffer())
            .pipe(gulp.dest('./.build/static'));
        }

    }

    if (watch) {
        bundler.on('update', function() {
            console.log(`-> bundling ${outputName}...`);
            rebundle();
        });
    }

    rebundle();
};

const watchReact = function() {
    return compileReact(...arguments, true);
};
gulp.task('apply-prod-environment', function() {
    process.env.NODE_ENV = 'production';
});

gulp.task('create-route', () => {
    const askOnlyIfNotAccessibleLoggedOut = (answers) => {
        if (answers['logged-out-access']) {
            return false;
        }

        return true;
    };

    const questions = [
        {
            type: 'input',
            name: 'route-endpoint',
            message: 'route endpoint:',
            validate: (response) => {
                if (response.length <= 0) {
                    return 'endpoint needs to be set';
                }

                if (response[0] !== '/') {
                    return 'endpoint needs to start with a /';
                }

                return true;
            }
        },
        {
            type: 'input',
            name: 'page-title',
            message: 'page title:',
            validate: (response) => {
                if (response.length <= 0) {
                    return 'page title needs to be set';
                }

                return true;
            }
        },
        {
            type: 'confirm',
            name: 'logged-out-access',
            message: 'Should this page be accessible when a user is logged out?:',
            default: false
        },
        {
            type: 'confirm',
            name: 'admin-access',
            message: 'Should admins be allowed access to this page?:',
            default: true,
            when: askOnlyIfNotAccessibleLoggedOut
        },
        {
            type: 'confirm',
            name: 'instructor-access',
            message: 'Should instructors be allowed access to this page?:',
            default: true,
            when: askOnlyIfNotAccessibleLoggedOut
        },
        {
            type: 'confirm',
            name: 'student-access',
            message: 'Should students be allowed access to this page?:',
            default: true,
            when: askOnlyIfNotAccessibleLoggedOut
        },
        {
            type: 'input',
            name: 'icon',
            message: 'Font Awesome icon name (e.g. cog):',
            default: ''
        },
        {
            type: 'confirm',
            name: 'show-in-sidebar',
            message: 'Should this page be shown in the sidebar?',
            default: false
        }
    ];

    return inquirer.prompt(questions).then((answers) => {

    // if logged-out-access is true then student, instructor, and admin access should default to true
        if (answers['student-access'] == null) {
            answers['student-access'] = true;
        }

        if (answers['instructor-access'] == null) {
            answers['instructor-access'] = true;
        }

        if (answers['admin-access'] == null) {
            answers['admin-access'] = true;
        }

        var routeFileName = answers['page-title'].toLowerCase().split(' ').join('-');

        const routeConfigFilePath = `${__dirname}/server/routes/route-configs/${routeFileName}.js`;
        const routeHandlerFilePath = `${__dirname}/server/routes/route-handlers/${routeFileName}.js`;

        const configContents =
`const handler = require('../route-handlers/${routeFileName}');

module.exports = {
    route: '${answers['route-endpoint']}',
    title: '${answers['page-title']}',
    routeHandler: handler,
    access: {
        admins: ${answers['admin-access']},
        instructors: ${answers['instructor-access']},
        students: ${answers['student-access']},
        loggedOut: ${answers['logged-out-access']}
    },
    icon: '${answers['icon']}',
    sidebar: ${answers['show-in-sidebar']}
};
`;

        const routeContents =
`
exports.get = (req, res) => {
    if(req.App.user === undefined){
      res.redirect('/');
    }
    res.status(405).end();
};
`;

        fs.writeFileSync(routeConfigFilePath, configContents);
        fs.writeFileSync(routeHandlerFilePath, routeContents);

        const routesFileName = `${__dirname}/server/routes/routes.js`;

        const currentRoutesContents = fs.readFileSync(routesFileName);
        var initialPieces = currentRoutesContents.toString().split('const pages = [');
        var secondPiecesPieces = initialPieces[1].split('\n]');

        const newPagesArrayContents =
`${secondPiecesPieces[0]},
    '${routeFileName}'`;

        secondPiecesPieces[0] = newPagesArrayContents;
        initialPieces[1] = secondPiecesPieces.join('\n]');
        const routesWithNewRoute = initialPieces.join('const pages = [');

        fs.writeFileSync(routesFileName, routesWithNewRoute);

        gutil.log(`Endpoint created. Handler at ${routeHandlerFilePath}`);
    });
});

gulp.task('node-babel', () => {
    return gulp.src(['server/**/*.js', '!server/{views,views/**}'])
    .pipe(babel({
        plugins: ['transform-flow-strip-types']
    }))
    .pipe(gulp.dest('.build'));
});

gulp.task('node-babel:watch', () => {
    gulp.watch(['server/**/*.js', '!server/{views,views/**}'], ['node-babel']);
});

gulp.task('build-views', () => {
    return gulp.src('server/views/**')
    .pipe(gulp.dest('.build/views'));
});

gulp.task('build-views:watch', () => {
    gulp.watch('server/views/**', ['build-views']);
});

gulp.task('setup-static', () => {
    return gulp.src('static/**/*')
    .pipe(gulp.dest('.build/static'));
});

gulp.task('sass', () => {
    return gulp.src('./styles/**/*.scss')
    .pipe(sass().on('error', function (error) {
        sass.logError.call(this, error);
        gutil.beep();
    }))
    .pipe(postcss([ autoprefixer() ]))
    .pipe(gulp.dest('./.build/static'));
});

gulp.task('flowtype', () => {
    return gulp.src(['server/**/*.js'])
    .pipe(flow());
});

gulp.task('flowtype:watch', () => {
    gulp.watch(['server/**/*.js'], ['flowtype']);
});

gulp.task('sass:watch', () => {
    gulp.watch('./styles/**/*.scss', ['sass']);
});

gulp.task('react:compile', () => {
    compileReact('/main.js', 'react_apps');
});

gulp.task('react:watch', () => {
    watchReact('/main.js', 'react_apps');
});

gulp.task('start', ['node-babel'], function () {
    nodemon({
        script: '.build/server.js',
        ext: 'js html',
        ignore: ['react/*', 'styles/*']
    });
});

gulp.task('build-server', ['node-babel', 'build-views', 'setup-static']);

gulp.task('build-assets', ['sass', 'react:compile']);

gulp.task('clean:build', () => {
    return del([argv.location + '/**/*'], {force: true});
});

gulp.task('move:server-build', () => {
    const dest = gulp.dest(argv.location + '/server'|| '../build' + '/server');
    return gulp.src(['.build/**/*'])
  .pipe(dest);
});

gulp.task('move:config-build', () => {
    return gulp.src(['package.json'])
  .pipe(gulp.dest(argv.location || '../build'))
  .pipe(install({production: true}));
});

gulp.task('generate:build-fallback-settings', () => {
    const questions = [
        {
            type: 'input',
            name: 'redis-secret',
            message: 'redis secret (the secret string for cookies stored in Redis):'
        },
        {
            type: 'input',
            name: 'redis-host',
            message: 'redis host (hostname or location of Redis):'
        },
        {
            type: 'input',
            name: 'redis-port',
            message: 'redis port:'
        },
        {
            type: 'input',
            name: 'redis-auth',
            message: 'redis auth (password for Redis server):'
        },
        {
            type: 'input',
            name: 'server-port',
            message: 'server port (local port that frontend server will run on):'
        },
    ];

    return inquirer.prompt(questions).then((answers) => {
        const content =
`
exports.REDIS_SECRET = '${answers['redis-secret']}';
exports.REDIS_HOST = '${answers['redis-host']}';
exports.REDIS_PORT = ${answers['redis-port']};
exports.REDIS_AUTH = '${answers['redis-auth']}';
exports.FRONTEND_PORT = ${answers['server-port']};

// ###!! You need to add the fallback API URL to server/utils/react_constants.js  !!###
`;
        console.log('###!! You need to add the fallback API URL to server/utils/react_constants.js  !!###');
        return file('fallback_settings.js', content)
    .pipe(gulp.dest(argv.location || '../build'));
    });
});

gulp.task('generate:fallback-settings', () => {
    const questions = [
        {
            type: 'input',
            name: 'redis-secret',
            message: 'redis secret (the secret string for cookies stored in Redis):'
        },
        {
            type: 'input',
            name: 'redis-host',
            message: 'redis host (hostname or location of Redis):'
        },
        {
            type: 'input',
            name: 'redis-port',
            message: 'redis port:'
        },
        {
            type: 'input',
            name: 'redis-auth',
            message: 'redis auth (password for Redis server):'
        },
        {
            type: 'input',
            name: 'server-port',
            message: 'server port (local port that frontend server will run on):'
        }
    ];

    return inquirer.prompt(questions).then((answers) => {
        const content =
`
exports.REDIS_SECRET = '${answers['redis-secret']}';
exports.REDIS_HOST = '${answers['redis-host']}';
exports.REDIS_PORT = ${answers['redis-port']};
exports.REDIS_AUTH = '${answers['redis-auth']}';
exports.FRONTEND_PORT = ${answers['server-port']};

// ###!! You need to add the fallback API URL to server/utils/react_constants.js  !!###

`;
        console.log('###!! You need to add the fallback API URL to server/utils/react_constants.js  !!###');
        return file('fallback_settings.js', content)
    .pipe(gulp.dest(__dirname));
    });
});

gulp.task('build-production', () => {
    return runSequence(['apply-prod-environment','build-server', 'build-assets', 'clean:build'], 'generate:build-fallback-settings', ['move:server-build', 'move:config-build']);
});

gulp.task('default', [
    'build-server',
    'build-assets',
    'node-babel:watch',
    'build-views:watch',
    'sass:watch',
    'react:watch',
    'flowtype:watch',
    'start'
]);
