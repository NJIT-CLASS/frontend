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

const compileReact = (rootFile, outputName, watch) => {
  const bundler = watchify(browserify(`./react${rootFile}`, { debug: true }).transform(babelify));

  function rebundle() {
    bundler.bundle()
      .on('error', function(err) {
        console.error(err);
        gutil.beep();
        this.emit('end');
      })
      .pipe(source(`${outputName}.js`))
      .pipe(buffer())
      .pipe(gulp.dest('./.build/static'));
  }

  if (watch) {
    bundler.on('update', function() {
      console.log(`-> bundling ${outputName}...`);
      rebundle();
    });
  }

  rebundle();
}

const watchReact = function() {
  return compileReact(...arguments, true);
};

gulp.task('node-babel', () => {
  return gulp.src(['server/**/*.js', '!server/{views,views/**,static,static/**/*}'])
    .pipe(babel({
      plugins: ['transform-flow-strip-types']
    }))
    .pipe(gulp.dest('.build'));
});

gulp.task('node-babel:watch', () => {
  gulp.watch(['server/**/*.js', '!server/{views,views/**,static,static/**/*}'], ['node-babel']);
});

gulp.task('build-views', () => {
  return gulp.src('server/views/**')
    .pipe(gulp.dest('.build/views'));
});

gulp.task('build-views:watch', () => {
  gulp.watch('server/views/**', ['build-views']);
});

gulp.task('setup-static', () => {
  return gulp.src('server/static/**/*')
    .pipe(gulp.dest('.build/static'));
});

gulp.task('sass', () => {
  return gulp.src('./styles/**/*.scss')
    .pipe(sass().on('error', function (error) {
      sass.logError.call(this, error);
      gutil.beep();
    }))
    .pipe(gulp.dest('./.build/static'));
});
 
gulp.task('sass:watch', () => {
  gulp.watch('./styles/**/*.scss', ['sass']);
});

gulp.task('create_course:compile', () => {
    compileReact('/create-course/main.js', 'create_course');
});

gulp.task('create_course:watch', () => {
    watchReact('/create-course/main.js', 'create_course');
});

gulp.task('create_assgn:compile', () => {
    compileReact('/create-assignment/main.js', 'create_assignment');
});

gulp.task('create_assgn:watch', () => {
    watchReact('/create-assignment/main.js', 'create_assignment');
});

gulp.task('start', ['node-babel'], function () {
  nodemon({
    script: '.build/server.js',
    ext: 'js html'
  });
});

gulp.task('build-server', ['node-babel', 'build-views', 'setup-static'])

gulp.task('compile-assets', ['sass', 'create_course:compile', 'create_assgn:compile']);

gulp.task('default', ['build-server', 'compile-assets', 'node-babel:watch', 'build-views:watch', 'sass:watch', 'create_course:watch', 'create_assgn:watch', 'start']);
