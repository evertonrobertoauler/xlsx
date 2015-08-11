var portfinder = require('portfinder');
var path = require('path');
var gulp = require('gulp');
var gulpShell = require('gulp-shell');
var exec = require('child_process').exec;
var replace = require('gulp-replace');
var open = require('open');
var Q = require('q');
var del = require('del');
var liveServer = require('gulp-live-server');

var webpackConfig = require('./webpack.config');

var paths = {
  app: path.join(path.relative(__dirname, webpackConfig.context), '..'),
  config: path.relative(__dirname, './webpack.config.js'),
  src: path.relative(__dirname, webpackConfig.context),
  dist: path.relative(__dirname, webpackConfig.output.path)
};

var shellTasks = {
  webpackProduction: 'NODE_ENV=production node node_modules/.bin/webpack --colors',
  webpackDevelopment: 'NODE_ENV=development node node_modules/.bin/webpack --colors'
};

gulp.task('serve', ['watch'], startLiveServer);
gulp.task('build', gulpShell.task([shellTasks.webpackProduction, shellTasks.webpackDevelopment]));
gulp.task('clean', clean([paths.dist]));

gulp.task('watch', ['fixWebpack'], watch);
gulp.task('fixWebpack', fixWebpack);

function watch() {
  var cmd = exec(shellTasks.webpackDevelopment + ' --watch');
  cmd.stdout.on('data', function(data) {
    console.log(data);
  });
}

function clean(files) {
  return function() {
    return callbackToPromise(del, [files]);
  };
}

function fixWebpack() {
  var dest = __dirname + '/node_modules/webpack/node_modules/watchpack/lib';

  var stream = gulp
    .src(dest + '/DirectoryWatcher.js')
    .pipe(replace('usePolling: options.poll ? true : undefined', 'usePolling: true'))
    .pipe(replace('interval: typeof options.poll === "number" ? options.poll : undefined', 'interval: 500'))
    .pipe(gulp.dest(dest));

  return streamToPromise(stream);
}

function streamToPromise(stream) {
  var deferred = Q.defer();

  stream.resume();

  stream
    .once('error', function(err) {
      deferred.reject(err);
    })
    .once('finish', function() {
      deferred.resolve();
    })
    .once('end', function() {
      deferred.resolve();
    });

  return deferred.promise;
}

function callbackToPromise(fn, params) {
  var deferred = Q.defer();

  function done(err, data) {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve(data);
    }
  }

  params.push(done);
  fn.apply(null, params);

  return deferred.promise;
}

function startLiveServer() {
  var livereloadPort;

  return findAvailablePort(35729)
    .then(function(port) {
      livereloadPort = port;
      return findAvailablePort(9000);
    })
    .then(function(serverPort) {

      var server = liveServer([liveServer.script, paths.app, serverPort], undefined, livereloadPort);

      server.start();

      open('http://localhost:' + serverPort, 'google-chrome');

      gulp.watch([paths.dist + '/**/*', paths.app + '/index.html'], function() {
        server.notify.apply(server, arguments);
      });
    });
}

function findAvailablePort(basePort) {
  portfinder.basePort = basePort;
  return callbackToPromise(portfinder.getPort, []);
}
