var gulp = require('gulp');
var dest = require('gulp');
var browserify = require('browserify');
var clean = require('gulp-clean');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var tsify = require('tsify');
var connect = require('gulp-connect');

gulp.task('clean', function () {
    return gulp.src('dist/**', { read: false }).pipe(clean());
});

gulp.task('copy-static', function () {
    return gulp.src('src/static/**').pipe(gulp.dest('dist/'));
});

gulp.task('serve', function () {
    connect.server({
        root: 'dist',
        livereload: true
    });
});

gulp.task('build', function () {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['src/ts/main.ts'],
        cache: {},
        packageCache: {}
    })
        .plugin(tsify)
        .transform('babelify', {
            presets: ['@babel/preset-env'],
            extensions: ['.ts']
        })
        .bundle()
        .pipe(source('index.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('build:prod', gulp.series('clean', 'copy-static', 'build'));
gulp.task('run', gulp.series('build:prod', 'serve'));