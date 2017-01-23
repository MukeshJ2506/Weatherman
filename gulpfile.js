var gulp = require('gulp'),
    rimraf = require('rimraf'),
    Builder = require('systemjs-builder'),
    runSequence = require('run-sequence'),
    htmlMinifier = require('html-minifier'),
    inlineNg2Template = require('gulp-inline-ng2-template'),
 //   cors = require('cors'),
    plugins = require('gulp-load-plugins')({
        lazy: true
    });

var tsProject = plugins.typescript.createProject('tsconfig.json');

var cors = function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
};

var paths = {
    assets: [
        'client/**/*.html',
        'client/**/*.js',
        'client/**/*.css'
    ],
    vendors: [
        'node_modules/core-js/client/shim.js',
        'node_modules/zone.js/dist/zone.js',
        'node_modules/reflect-metadata/Reflect.js'
    ],
    systemjsConfig: 'client/systemjs.config.js',
    css: [
        'client/css/main.css'
    ],
    prod: 'dist/prod/',
    dev: 'dist/dev/',
    tmp: 'dist/tmp/'
};

function minifyTemplate(path, ext, file, cb) {
    try {
        var minifiedFile = htmlMinifier.minify(file, {
            collapseWhitespace: true,
            caseSensitive: true,
            removeComments: true,
            removeRedundantAttributes: true
        });
        cb(null, minifiedFile);
    }
    catch (err) {
        cb(err);
    }
}

gulp.task('inject:index', function () {
    var target = gulp.src('client/index.html');

    var sources = gulp.src([
        'dist/prod/vendors.min.js',
        'dist/prod/app.min.js',
        'dist/prod/styles.min.css'
    ], { read: false });

    return target.pipe(plugins.inject(sources, { ignorePath: paths.prod, addRootSlash: false }))
        .pipe(gulp.dest(paths.prod));
});

gulp.task('tsc', function () {
    return gulp.src(['client/**/*.ts'])
        .pipe(plugins.sourcemaps.init())
        .pipe(tsProject())
        .pipe(plugins.sourcemaps.write('/'))
        .pipe(gulp.dest(paths.dev))
        .pipe(plugins.connect.reload());
});

gulp.task('inline-ng2-templates', function () {
    return gulp.src(['client/**/*.ts'])
        .pipe(inlineNg2Template({ base: 'client', useRelativePaths: false, indent: 0, removeLineBreaks: true, templateProcessor: minifyTemplate }))
        .pipe(tsProject())
        .pipe(gulp.dest(paths.tmp));
});

gulp.task('bundle:css', function() {
    return gulp.src(paths.css)
        .pipe(plugins.concat('styles.min.css'))
        .pipe(plugins.cleanCss())
        .pipe(gulp.dest(paths.prod));
});

gulp.task('bundle:vendors', function() {
    return gulp.src(paths.vendors)
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.concat('vendors.min.js'))
        .pipe(plugins.uglify())
        .pipe(plugins.sourcemaps.write('/'))
        .pipe(gulp.dest(paths.prod));
});

gulp.task('bundle:app', function() {
    var builder = new Builder(paths.tmp, paths.systemjsConfig);

    return builder.buildStatic('app/main.js', paths.prod + 'app.min.js', { minify: true, sourceMaps: true });
});

gulp.task('copy:assets', function() {
    return gulp.src(paths.assets).pipe(gulp.dest(paths.dev)).pipe(plugins.connect.reload());;
});

gulp.task('copy:index', function() {
    return gulp.src('client/index.html').pipe(gulp.dest(paths.prod));
});

gulp.task('clean:prod', function(done) {
    rimraf(paths.prod, done);
});

gulp.task('clean:dev', function(done) {
    rimraf(paths.dev, done);
});

gulp.task('clean:tmp', function(done) {
    rimraf(paths.tmp, done);
});

gulp.task('build:prod', function(done) {
    runSequence('clean:prod', 'inline-ng2-templates', 'bundle:css', 'bundle:vendors', 'bundle:app', 'inject:index', 'clean:tmp', done);
});

gulp.task('serve:prod', function(done) {
    runSequence('build:prod', ['connect:prod', 'watch'], done);
});

gulp.task('build:dev', function(done) {
    runSequence('clean:dev', 'tsc', 'copy:assets', done);
});

gulp.task('serve:dev', function(done) {
    runSequence('build:dev', ['connect:dev'], done);
});

gulp.task('connect:prod', function() {
    plugins.connect.server({
        root: paths.prod,
        port: 5000,
        livereload: true,
        middleware: function () {
            return [cors];
        },
        fallback: paths.prod + '/index.html'
    });
});

gulp.task('connect:dev', function() {
    plugins.connect.server({
        root: [paths.dev, './'],
        port: process.env.PORT || 5000,
        livereload: false,
        middleware: function () {
            return [cors];
        },
        fallback: paths.dev + '/index.html'
    });
});

gulp.task("watch", function () {
    gulp.watch(['client/**/*.ts'], ['tsc']);
    gulp.watch(['client/**/*.html', 'client/**/*.css',  'client/**/*.js'], ['copy:assets']);
});
