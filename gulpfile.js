'use strict';

var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var jshint = require('gulp-jshint');
var shell = require('gulp-shell');
var minimist = require('minimist');
var rename = require('gulp-rename');
var del = require('del');
var debug = require('gulp-debug');
var mocha = require('gulp-mocha');

// minimist defaults for task config
var knownOptions = {
    string: ['env'],
    'default': {
        env: 'dev'
    }
};
var options = minimist(process.argv.slice(2), knownOptions);

var srcDir = 'src/main';
var environmentDir = 'src/environment/' + options.env;
var testDir = 'src/test/**/*.js';
var buildDir = 'build/' + options.env + '/src';
var intermediateDir = 'build/intermediate/' + options.env;

gulp.task('deploy', ['build'], shell.task(['gapps upload'],
    {cwd: 'build/' + options.env}));

gulp.task('build', ['browserify'], function () {
    copyConfig();
    copyClientCode();
});

function copyConfig() {
    return gulp.src('gapps.config.json')
        .pipe(gulp.dest('build/' + options.env));
}

function copyClientCode() {
    return gulp.src([
        srcDir + '/ui/*.client.js',
        srcDir + '/ui/*.html',
        srcDir + '/ui/*.css'])
        .pipe(rename(function (path) {
            if (path.extname !== '.html') {
                path.extname = path.extname + '.html';
            }

            return path;
        }))
        .pipe(gulp.dest(buildDir));
}
gulp.task('browserify', ['copyServerCode'], function () {
    return browserify(intermediateDir + '/main.js')
        .plugin('gasify')
        .bundle()
        .pipe(source('main.js'))
        .pipe(gulp.dest(buildDir));
});

gulp.task('copyServerCode', function () {
    return gulp.src([environmentDir + '/*.js',
        srcDir + '/server/*.js'])
        .pipe(gulp.dest(intermediateDir));
});

gulp.task('test', ['build'], function () {
    return gulp.src(testDir, {read: false})
        .pipe(mocha());
});

gulp.task('clean', function () {
    return del([buildDir + '/**']);
});

gulp.task('cleanAll', function () {
    return del(['build/**']);
});

gulp.task('lint', function () {
    return gulp.src(srcDir + '/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});
