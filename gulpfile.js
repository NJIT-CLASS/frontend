const gulp = require('gulp');
const sass = require('gulp-sass');
const nodemon = require('gulp-nodemon');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserify = require('browserify');
const watchify = require('watchify');
const babel = require('babelify');

const compileReact = (rootFile, outputName, watch) => {
  const bundler = watchify(browserify(`./react${rootFile}`, { debug: true }).transform(babel));

  function rebundle() {
    bundler.bundle()
      .on('error', function(err) { console.error(err); this.emit('end'); })
      .pipe(source(`${outputName}.js`))
      .pipe(buffer())
      .pipe(gulp.dest('./static'));
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

gulp.task('sass', () => {
  return gulp.src('./styles/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./static'));
});
 
gulp.task('sass:watch', () => {
  gulp.watch('./styles/**/*.scss', ['sass']);
});

gulp.task('create:compile', () => {
    compileReact('/create-course/main.js', 'create_course');
});

gulp.task('create:watch', () => {
    watchReact('/create-course/main.js', 'create_course');
});

gulp.task('start', function () {
  nodemon({
    script: 'server.js',
    ext: 'js html'
  });
});

gulp.task('default', ['sass', 'sass:watch', 'create:watch', 'start']);
