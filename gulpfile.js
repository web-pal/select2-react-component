var gulp = require('gulp');
var gulpif = require('gulp-if');
var $ = require('gulp-load-plugins')();
var browserify = require('browserify');
var del = require('del');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var _ = require('lodash');

var browserSync = require('browser-sync');
var reload = browserSync.reload;

global.isProd = false;
global.needSourceMap = true;

var handleErrors = function() {
  var args = Array.prototype.slice.call(arguments);
  delete args[0].stream;
  $.util.log(args);
  this.emit('end');
};

gulp.task('clean', function(cb) {
  del([
    'lib/'
  ], cb);
});

var bundler = _.memoize(function(watch) {
  var options = {debug: true};
  if (global.isProd) {
    options.debug = false;
  }

  if (watch) {
    _.extend(options, watchify.args);
  }

  var b = browserify('./src/component.js', options);

  if (watch) {
    b = watchify(b);
  }

  return b;
});

function bundle(cb, watch) {
  return bundler(watch).bundle()
    .on('error', handleErrors)
    .pipe(source('component.js'))
    .pipe(buffer())
    .pipe(gulpif(global.needSourceMap, $.sourcemaps.init({ loadMaps: true })))
    .pipe(gulpif(global.needSourceMap, $.sourcemaps.write('./')))
    .pipe(gulp.dest('./lib'))
    .on('end', cb)
    .pipe(reload({ stream: true }));
}

gulp.task('scripts', function(cb) {
  process.env.BROWSERIFYSWAP_ENV = 'dist';
  var is_watch = true;
  if (global.isProd) {
    is_watch = false;
  }
  bundle(cb, is_watch);
});

var reporter = 'spec';

gulp.task('build-all', [
  'clean',
  'scripts'
]);

gulp.task('watch', ['build-all'], function(cb) {
  if (!global.isProd) {
    browserSync({
      server: {
        baseDir: 'dist'
      }
    });

    reporter = 'dot';
    bundler(true).on('update', function() {
      gulp.start('scripts');
    });
    gulp.watch(['./src/main.less', './src/**/*.less'], ['styles']);
  }
});

gulp.task('set_prod', function() {
  global.isProd = true;
  global.needSourceMap = false;
});

gulp.task('default', ['watch']);
gulp.task('build', ['set_prod', 'watch']);
