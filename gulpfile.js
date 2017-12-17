const gulp = require('gulp');
const concat = require('gulp-concat');
const minify = require("gulp-babel-minify");

gulp.task('concat', function() {
  return gulp.src(['./js/states/boot.js', './js/states/load.js', './js/states/menu.js', './js/states/play.js', './js/states/end.js', './js/states/game.js'])
    .pipe(concat({ path: 'bundle.js'}))
    .pipe(gulp.dest('./js'));
});

gulp.task("minify", () =>
  gulp.src("js/bundle.js")
    .pipe(minify())
    .pipe(gulp.dest("js"))
);