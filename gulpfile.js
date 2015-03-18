var gulp = require('gulp');
var path = require('path');
var $ = require('gulp-load-plugins')();
var del = require('del');
var connect = require('gulp-connect');
var stylus = require('gulp-stylus');
var jade = require('gulp-jade');
// set variable via $ gulp --type production
var environment = $.util.env.type || 'development';
var isProduction = environment === 'production';
var webpackConfig = require('./webpack.config.js')[environment];

var port = 8888;
var rootPath = 'app/';
var buildPath = 'build/';

// https://github.com/ai/autoprefixer
var autoprefixerBrowsers = [                 
  'ie >= 9',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 6',
  'opera >= 23',
  'ios >= 6',
  'android >= 4.4',
  'bb >= 10'
];

var paths = {
    scripts: {
        source: rootPath + 'scripts/main.js',
        destination: buildPath + 'scripts/',
        filename: 'bundle.js'
    },
    libs: {
        sources: ['bower_components/requirejs/require.js', 'bower_components/superagent/superagent.js'],
        destination: buildPath + 'scripts/'
    },
    styles: {
        sources: [rootPath + 'stylus/*.styl'],
        //bootstrap: ['./bower_components/bootstrap/dist/css/*.min.css'],
        fonts: [],
        destination: buildPath + 'css/'
    },
    templates: {
      sources: rootPath + '**/*.jade',
      destination: buildPath
    },
    assets: {
        sources: [
            rootPath + 'img**/*.*', '!bower_components/**',
            rootPath + 'translations**/*.js'],
        destination: buildPath
    },
    configs: {},
    tests: {
      unittests: './test/__tests__',
      e2e: './test/e2e/**/*.js'
    }
};

gulp.task('scripts', function() {
  return gulp.src(webpackConfig.entry)
    .pipe($.webpack(webpackConfig))
    //.pipe(isProduction ? $.uglifyjs() : $.util.noop())
    .pipe(gulp.dest(paths.scripts.destination))
    //.pipe($.size({ title : 'js' }))
    .pipe(connect.reload());
});

gulp.task('templates', function() {
  return gulp.src(paths.templates.sources)
  .pipe(jade({
    //pretty: !production
  }))
  .pipe(gulp.dest(paths.templates.destination));
});


gulp.task('styles',function(cb) {

  // convert stylus to css
  return gulp.src(paths.styles.sources)
    .pipe(stylus({
      // only compress if we are in production
      compress: isProduction,
      // include 'normal' css into main.css
      'include css' : true
    }))
    .pipe($.autoprefixer({browsers: autoprefixerBrowsers})) 
    .pipe(gulp.dest(paths.styles.destination))
    //.pipe($.size({ title : 'css' }))
    .pipe(connect.reload());

});

// add livereload on the given port
gulp.task('serve', function() {
  connect.server({
    root: buildPath,
    port: port,
    livereload: {
      port: 35729
    }
  });
});

// copy images
gulp.task('assets', function(cb) {
  return gulp.src(paths.assets.sources).pipe(gulp.dest(paths.assets.destination));
});

// watch styl, html and js file changes
gulp.task('watch', function() {
  gulp.watch(rootPath + 'stylus/*.styl', ['styles']);
  gulp.watch(rootPath + 'index.jade', ['templates']);
  gulp.watch(rootPath + 'scripts/**/*.js', ['scripts']);
  gulp.watch(rootPath + 'scripts/**/*.jsx', ['scripts']);
});

// remove bundels
gulp.task('clean', function(cb) {
  del([buildPath], cb);
});


// by default build project and then watch files in order to trigger livereload
gulp.task('default', ['build', 'serve', 'watch']);

// waits until clean is finished then builds the project
gulp.task('build', ['clean'], function(){
  gulp.start(['assets', 'templates','scripts','styles']);
});
