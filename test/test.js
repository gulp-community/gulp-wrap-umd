'use strict';

var test = require('tap').test;

var gulp = require('gulp');
var task = require('../');
var through = require('through2');
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
  return through.obj(function(file, enc, cb){
    options.contents = fs.readFileSync(file.path, 'utf-8');
    var expected = _.template(jst, options);
    t.equals(expected, String(file.contents));
    cb();
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
      deps: [{name: 'jade', amdName: 'jade', cjsName: 'jade', globalName: 'jade', paramName: 'jade'}],
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
      deps: [
        {name: 'jade', amdName: 'jade', cjsName: 'jade', globalName: 'jade', paramName: 'jade'},
        {name: 'lodash', amdName: 'lodash', cjsName: 'lodash', globalName: 'lodash', paramName: 'lodash'}
      ],
      namespace: 'test'
    }));
});

test('should wrap a function in UMD wrapper using extended deps syntax', function(t){
  t.plan(1);

  gulp.src(filename)
    .pipe(task({
      deps: [
        {name: 'jquery', globalName: 'jQuery'},
        'jade',
        {name: 'lodash', globalName: '_', amdName: '../lodash'}
      ],
      params: ['$', 'jade', '_'],
      namespace: 'test'
    }))
    .pipe(expectStream(t, {
      deps: [
        {name: 'jquery', amdName: 'jquery', cjsName: 'jquery', globalName: 'jQuery', paramName: '$'},
        {name: 'jade', amdName: 'jade', cjsName: 'jade', globalName: 'jade', paramName: 'jade'},
        {name: 'lodash', amdName: '../lodash', cjsName: 'lodash', globalName: '_', paramName: '_'}
      ],
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
      deps: [{name: 'domReady', amdName: 'domReady', cjsName: 'domReady', globalName: 'domReady', paramName: 'domReady'}],
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
      deps: [{name: 'test', amdName: 'test', cjsName: 'test', globalName: 'test', paramName: 'test'}],
      namespace: 'test'
    }));
});

test('should use a custom template', function(t){
  var tmpl = '<%= contents %>';

  function expectStream(t, options){
    options = _.defaults(options || {}, {
      deps: null,
      params: null,
      exports: null,
      namespace: 'test',
      contents: null
    });
    return through.obj(function(file, enc, cb){
      options.contents = fs.readFileSync(file.path, 'utf-8');
      var expected = _.template(tmpl, options);
      t.equals(expected, String(file.contents));
      cb();
    });
  }

  t.plan(2);

  gulp.src(path.join(__dirname, './fixtures/test-*.js'))
    .pipe(task({
      template: tmpl
    }))
    .pipe(expectStream(t, {
      template: tmpl
    }));
});
