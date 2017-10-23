const path = require('path');
const source = require('vinyl-source-stream');

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();

const babelify = require('babelify');
const watchify = require('watchify');
const exorcist = require('exorcist');
const browserify = require('browserify');
const browserSync = require('browser-sync').create();

const config = {

    browserSync: require('./browser-sync'),

    src: 'src',
    public: 'public',
    dist: 'public/build',

    app: {
        src: 'app.jsx',
        dist: 'app.js'
    },

};

// Watchify args contains necessary cache options to achieve fast incremental bundles.
// See watchify readme for details. Adding debug true for source-map generation.
watchify.args.debug = true;
watchify.args.extensions = ['.js', '.jsx'];

const appJsBundler = watchify(
    browserify(
        path.join(config.src, config.app.src),
        watchify.args
    )
);

// Babel transform
appJsBundler.transform(babelify.configure({
    sourceMapRelative: config.src,
    presets: ['env', 'react']
}));

// On updates recompile JavaScript
appJsBundler.on('update', bundleAppJs);

// Builds JavaScript
function bundleAppJs() {

    // $.util.log('Compiling JS...');

    const error = function (err) {
        $.util.log(err.message);
        browserSync.notify('Browserify Error!');
        this.emit('end');
    };

    return appJsBundler.bundle()
        .on('error', error)
        .pipe(exorcist(path.join(config.dist, config.app.dist, '.map')))
        .pipe(source(config.app.dist))
        .pipe(gulp.dest(config.dist))
        .pipe(browserSync.stream({ once: true }));

}

// *** Gulp Task: Build our JavaScript ***
gulp.task('js:app', () => bundleAppJs());

// *** Gulp Task: Build all JavaScript ***
gulp.task('js', ['js:app']);

// *** Gulp Task: Build Stylesheets ***
gulp.task('css', () =>
    gulp.src(path.join(config.src, '**/*.scss'))
        .pipe($.sourcemaps.init())
        .pipe($.sass())
        .pipe($.flatten())
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest(config.dist))
        .pipe(browserSync.stream({ once: true }))
);

// *** Gulp Task: Build everything once ***
gulp.task('default', ['js', 'css']);

// *** Gulp Task: Build js files when they change ***
gulp.task('watch:js', ['default'], () => {
    gulp.watch(path.join(config.src, '**/*.@(js|jsx)'), ['js']);
});

// *** Gulp Task: Build css files when they change ***
gulp.task('watch:css', ['default'], () => {
    gulp.watch(path.join(config.src, '**/*.@(scss|css)'), ['css']);
});

// *** Gulp Task: Build everything whenever files change ***
gulp.task('watch', ['watch:js', 'watch:css']);

// *** Gulp Task: Serve application, and build & refresh whenever files change ***
gulp.task('start', ['watch:js', 'watch:css'], () => {

    browserSync.init(config.browserSync);

    // Watch for any unaccounted for changes
    gulp.watch([
        path.join(config.public, '**/*'),
        path.join('!' + config.public, '**/*.js'),
        path.join('!' + config.public, '**/*.css'),
    ]).on('change', browserSync.reload);

});

