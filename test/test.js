'use strict';

var test = require('tap').test;

var gulp = require('gulp');
var task = require('../');
var es = require('event-stream');
var path = require('path');
var fs = require('fs');
var _ = require('lodash');

var filename = path.join(__dirname, './fixtures/helloworld.js');
var exportFilename = path.join(__dirname, './fixtures/exports.js');
var jst = fs.readFileSync(path.join(__dirname, '../templates/umd.jst'), 'utf-8');

function expectStream(t, options){
  options = _.defaults(options || {}, {
    deps: null,
    params: null,
    exports: null,
    namespace: 'test',
    contents: null
  });
  return es.map(function(file){
    options.contents = fs.readFileSync(file.path, 'utf-8');
    var expected = _.template(jst, options);
    t.equals(expected, String(file.contents));
  });
}

test('should wrap a function in simple UMD wrapper', function(t){
  t.plan(1);

  gulp.src(filename)
    .pipe(task({
      namespace: 'test'
    }))
    .pipe(expectStream(t));
});

test('should wrap a function in simple UMD wrapper if missing deps but has params', function(t){
  t.plan(1);

  gulp.src(filename)
    .pipe(task({
      params: ['jade'],
      namespace: 'test'
    }))
    .pipe(expectStream(t));
});

test('should wrap a function in UMD wrapper with single custom dep and param', function(t){
  t.plan(1);

  gulp.src(filename)
    .pipe(task({
      deps: ['jade'],
      params: ['jade'],
      namespace: 'test'
    }))
    .pipe(expectStream(t, {
      deps: ['jade'],
      params: ['jade'],
      namespace: 'test'
    }));
});

test('should wrap a function in UMD wrapper with multiple custom deps and params', function(t){
  t.plan(1);

  gulp.src(filename)
    .pipe(task({
      deps: ['jade', 'lodash'],
      params: ['jade', 'lodash'],
      namespace: 'test'
    }))
    .pipe(expectStream(t, {
      deps: ['jade', 'lodash'],
      params: ['jade', 'lodash'],
      namespace: 'test'
    }));
});

test('should wrap a function in UMD wrapper with custom deps', function(t){
  t.plan(1);

  gulp.src(filename)
    .pipe(task({
      deps: ['domReady'],
      namespace: 'test'
    }))
    .pipe(expectStream(t, {
      deps: ['domReady'],
      namespace: 'test'
    }));
});

test('should wrap a function in UMD wrapper with custom return variable', function(t){
  t.plan(1);

  gulp.src(exportFilename)
    .pipe(task({
      exports: 'helloWorld',
      namespace: 'test'
    }))
    .pipe(expectStream(t, {
      exports: 'helloWorld',
      namespace: 'test'
    }));
});

test('should isolate the contents of the individual files', function(t){
  t.plan(2);

  gulp.src(path.join(__dirname, './fixtures/test-*.js'))
    .pipe(task({
      deps: ['test'],
      namespace: 'test'
    }))
    .pipe(expectStream(t, {
      deps: ['test'],
      namespace: 'test'
    }));
});
