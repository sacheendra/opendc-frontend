'use strict';

const gulp = require('gulp');
const notify = require('gulp-notify');
const source = require('vinyl-source-stream');
const es = require('event-stream');
const less = require('gulp-less');
const browserify = require('browserify');
const tsify = require('tsify');
const gulpTypings = require("gulp-typings");
const rename = require('gulp-rename');
const processHTML = require('gulp-processhtml');
const del = require('del');
const bower = require('gulp-bower');


/**
 * STYLES
 */
const stylesRootDir = './src/styles/';
const stylesDestDir = './build/styles/';

const styleFileNames = ['main', 'splash', 'projects', 'profile', 'navbar', '404'];
const styleFilePaths = styleFileNames.map(function (fileName) {
    return stylesRootDir + fileName + '.less';
});

gulp.task('styles', function () {
    return gulp.src(styleFilePaths)
        .pipe(less())
        .pipe(gulp.dest(stylesDestDir))
        .pipe(notify({message: 'Styles task complete', onLast: true}));
});


/**
 * SCRIPTS
 */
const scriptsRootDir = './src/scripts/';
const scriptsDestDir = './build/scripts/';

const postfix = '.entry';
const scriptsFileNames = ['splash', 'main', 'projects', 'profile', 'error404'];
const scriptsFilePaths = scriptsFileNames.map(function (fileName) {
    return scriptsRootDir + fileName + postfix + '.ts';
});

gulp.task('scripts', function () {
    var tasks = scriptsFilePaths.map(function (entry, index) {
        return browserify({entries: [entry]})
            .plugin(tsify, {insertGlobals: true})
            .bundle()
            .pipe(source(scriptsFileNames[index] + postfix + '.js'))
            .pipe(gulp.dest(scriptsDestDir));
    });
    return es.merge.apply(null, tasks)
        .pipe(notify({message: 'Scripts task complete', onLast: true}));
});


/**
 * TYPESCRIPT DEFINITIONS
 */
gulp.task("typings", function () {
    return gulp.src("./typings.json")
        .pipe(gulpTypings())
        .pipe(notify({message: 'Typings task complete'}));
});


/**
 * HTML
 */
const htmlRootDir = './src/';
const htmlDestDir = './build/';

const htmlFileNames = ['index', 'app', 'projects', 'profile', '404'];
const htmlFilePaths = htmlFileNames.map(function (fileName) {
    return htmlRootDir + fileName + '.html';
});

gulp.task('html', function () {
    return gulp.src(htmlFilePaths)
        .pipe(processHTML())
        .pipe(gulp.dest(htmlDestDir))
        .pipe(notify({message: 'HTML task complete', onLast: true}));
});


/**
 * IMAGES
 */
const imagesRootDir = './src/img/';
const imagesDestDir = './build/img/';

const imagesFilePaths = [imagesRootDir + '**/*.png', imagesRootDir + '**/*.gif'];

gulp.task('images', function () {
    return gulp.src(imagesFilePaths)
        .pipe(gulp.dest(imagesDestDir))
        .pipe(notify({message: 'Images task complete', onLast: true}));
});


/**
 * CLEAN
 */
gulp.task('clean', function () {
    return del(['./build']);
});


/**
 * BOWER
 */
gulp.task('bower', function () {
    return bower({cmd: 'install'}, ['--allow-root'])
        .pipe(notify({message: 'Bower task complete', onLast: true}));
});


/**
 * DEFAULT TASK
 */
gulp.task('default', ['clean', 'typings'], function () {
    gulp.start('styles', 'bower', 'scripts', 'html', 'images');
});


/**
 * WATCH
 */
gulp.task('watch', ['default'], function () {
    gulp.watch(stylesRootDir + '**/*.less', ['styles']);
    gulp.watch(scriptsRootDir + '**/*.ts', ['scripts']);
    gulp.watch(htmlRootDir + '**/*.html', ['html']);
    gulp.watch(imagesRootDir + '**/*.png', ['images']);
});
