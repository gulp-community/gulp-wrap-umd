'use strict';

var test = require('tap').test;

var task = require('../');

var es = require('event-stream');
var path = require('path');
var fs = require('fs');
var gutil = require('gulp-util');
var _ = require('lodash');

var filePath = path.join(__dirname, './fixtures/helloworld.js');
var base = path.join(__dirname, 'fixtures');
var cwd = __dirname;

var jst = fs.readFileSync(path.join(__dirname, '../templates/umd.jst'), 'utf-8');

var expected = _.template(jst, {
  deps: null,
  params: null,
  exports: null,
  namespace: 'test',
  contents: fs.readFileSync(filePath)
});

var file = new gutil.File({
  path: filePath,
  base: base,
  cwd: cwd,
  contents: fs.createReadStream(filePath)
});

test('should buffer the entire stream before compiling', function(t){
  var stream = task({
    namespace: 'test'
  });
  stream.on('data', function(file){
    file.contents.pipe(es.wait(function(err, data){
      if(err){
        throw err;
      }
      t.equals(data, expected, 'template should be wrapped in UMD');
      t.end();
    }));
  });
  stream.write(file);
  stream.end();
});
