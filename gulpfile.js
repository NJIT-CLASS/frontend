const gulp = require('gulp');
const sass = require('gulp-sass');
const nodemon = require('gulp-nodemon');

 
gulp.task('sass', () => {
  return gulp.src('./styles/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./static'));
});
 
gulp.task('sass:watch', () => {
  gulp.watch('./styles/**/*.scss', ['sass']);
});

gulp.task('start', function () {
  nodemon({
    script: 'server.js',
    ext: 'js html'
  });
});

gulp.task('default', ['sass', 'sass:watch', 'start'])