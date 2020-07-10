var gulp = require('gulp');
var browserify = require('browserify');
var clean = require('gulp-clean');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var tsify = require('tsify');
var Server = require('karma').Server;

gulp.task('clean', function () {
    return gulp.src('dist/**', { read: false }).pipe(clean());
});

gulp.task('build', function () {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['lib/src/formatter.ts'],
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
        .pipe(gulp.dest('dist'));
});

gulp.task('build:test', function () {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['lib/src/formatter.ts', 'spec/main.spec.ts'],
        cache: {},
        packageCache: {}
    })
        .plugin(tsify)
        .transform('babelify', {
            presets: ['@babel/preset-env'],
            extensions: ['.ts']
        })
        .bundle()
        .pipe(source('test-bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist/spec'));
});

gulp.task('karma', function (done) {
    return new Server({
        configFile: __dirname + '/karma.config.js',
        singleRun: true
    }, done).start()
});

gulp.task('karma:debug', function (done) {
    return new Server({
        configFile: __dirname + '/karma.config.js',
    }, done).start()
});

gulp.task('build:prod', gulp.series('clean', 'build:test', 'karma', 'build'));
gulp.task('test', gulp.series('clean', 'build:test', 'karma'));
gulp.task('test:debug', gulp.series('clean', 'build:test', 'karma:debug'));