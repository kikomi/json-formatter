var gulp = require('gulp');
var jasmineBrowser = require('gulp-jasmine-browser');
var watch = require('gulp-watch');

gulp.task('jasmine', function () {
    var filesToWatch = ['js/**/*.js', 'spec/**/*.spec.js', 'spec/static/*.json'];
    return gulp.src(filesToWatch)
        .pipe(watch(filesToWatch))
        .pipe(jasmineBrowser.specRunner())
        .pipe(jasmineBrowser.server({ port: 8888 }));
});