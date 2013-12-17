'use strict';

var es = require('event-stream');
var clone = require('lodash').clone;
var defaults = require('lodash').defaults;
var isStream = require('gulp-util').isStream;
var isBuffer = require('gulp-util').isBuffer;

var tmpl = require('./template').umd;

function compile(contents, opts){
  opts.contents = contents;
  return tmpl(opts);
}

function getOptions(file, opts){
  return defaults(clone(opts) || {}, {
    deps: null,
    params: null,
    exports: null,
    namespace: 'gulpWrapUmd',
    file: file
  });
}

module.exports = function(options){

  function wrap(file, callback){
    var opts = getOptions(file, options);

    if(isStream(file.contents)){
      var throughStream = es.through();
      var waitStream = es.wait(function(err, data){
        throughStream.write(compile(data, opts));
        throughStream.end();
      });
      file.contents.pipe(waitStream);
      file.contents = throughStream;
    }

    if(isBuffer(file.contents)){
      file.contents = new Buffer(compile(String(file.contents), opts));
    }

    callback(null, file);
  }

  return es.map(wrap);
};
