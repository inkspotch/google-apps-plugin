'use strict';

var gulp = require('gulp');
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
var testDir = 'src/test/**/*.js';
var buildDir = 'build/' + options.env + '/src';

gulp.task('deploy', ['build'], shell.task(['gapps upload'],
    {cwd: 'build/' + options.env}));

gulp.task('build', ['clean'], function () {
    copyEnvironmentCode();
    copyConfiguration();
    copyServerCode();
    copyClientCode();
});

function copyEnvironmentCode() {
    switch (options.env) {
        case 'dev':
            gulp.src('gapps.config.json')
                .pipe(gulp.dest('build/' + options.env))
            gulp.src(srcDir + '/**/*.js')
                .pipe(jshint())
                .pipe(jshint.reporter('jshint-stylish'));
            break;
        case 'test':
            gulp.src(srcDir + '/tests/*.js')
                .pipe(gulp.dest(buildDir));
            break;
    }

    return gulp.src(srcDir + '/environments/' + options.env + '/*.js')
        .pipe(gulp.dest(buildDir));
}

function copyConfiguration() {
    return gulp.src(srcDir + '/configuration.js')
        .pipe(gulp.dest(buildDir));
}

function copyServerCode() {
    return gulp.src([
        srcDir + '/server/*.js',
        srcDir + '/ui/*.server.js'])
        .pipe(gulp.dest(buildDir));
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

gulp.task('test', function () {
    return gulp.src(testDir, {read: false})
        .pipe(mocha());
});

gulp.task('clean', function () {
    return del([buildDir + '/**']);
});

gulp.task('cleanAll', function() {
   return del(['build/**']);
});

gulp.task('lint', function () {
    return gulp.src(srcDir + '/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});
