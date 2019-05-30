'use strict';

// Require gulp and plugins
var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    cleanCss = require('gulp-clean-css'),
    sourcemaps = require('gulp-sourcemaps'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename');


// Define file sources
var paths = {
    base: {
        node: 'node_modules'
    },
    src: {
        html: '**/*.html',
        css: 'assets/stylesheet',
        js: 'assets/javascript',
    }
}

// Task to compile SASS files
gulp.task('compile:scss', function () {
    return gulp
        .src(paths.src.css + "/main.scss") // use sassMain file source
        .pipe(sass().on('error', sass.logError))
        .pipe(browserSync.reload({
            stream: true
        }))
        .pipe(gulp.dest(paths.src.css)); // The destination for the compiled file
});

gulp.task('minify:css', function () {
    return gulp.src(paths.src.css + '/main.css')
        .pipe(sourcemaps.init())
        .pipe(cleanCss())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(paths.src.css))
});

// Task to concatenate and uglify js files
gulp.task('minify:js', function () {
    return gulp.src(paths.src.js + '/main.js')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(paths.src.js))
});

gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: './'
        },
        port: 3000
    });
});


// Task to watch for changes in our file sources
gulp.task('watch', function () {
    gulp.watch(paths.src.css + "/main.scss", gulp.series('compile:scss', 'minify:css')); // If any changes in 'sassMain', perform 'sass' task
    gulp.watch(paths.src.js + "/main.js", gulp.series('minify:js'));
    gulp.watch(paths.src.html, browserSync.reload);
});

// Build
gulp.task('build', gulp.series('compile:scss', 'minify:css', 'minify:js'));

// Default gulp task
gulp.task('default', gulp.series('browserSync', 'watch'));
