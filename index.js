'use strict';

var es = require('event-stream');
var _ = require('lodash');
var gutil = require('gulp-util');
var isStream = require('gulp-util').isStream;
var isBuffer = require('gulp-util').isBuffer;

var tmpls = require('./template');

function getOptions(file, opts) {
  opts = _.defaults(_.clone(opts) || {}, {
    deps: null,
    params: null,
    exports: null,
    template: 'umd',
    namespace: 'gulpWrapUmd',
    file: file
  });

  if (opts.deps) {
    opts.deps = opts.deps.map(function(inputDep, i) {
      var dep = typeof inputDep === 'string' ? {name: inputDep} : _.clone(inputDep);
      dep.globalName = dep.globalName || dep.name;
      dep.paramName = dep.paramName || (opts.params ? opts.params[i] : dep.globalName);
      dep.amdName = dep.amdName || dep.name;
      dep.cjsName = dep.cjsName || dep.name;
      return dep;
    });
  }

  return opts;
}

module.exports = function(options) {

  function wrap(file, callback) {
    var opts = getOptions(file, options);

    (function(callback) {
      if (opts.template in tmpls) {
        callback(tmpls[opts.template]);
      } else {
        fs.readFile(opts.template, {encoding: 'utf-8'}, function(err, tmplCode) {
          callback(_.template(tmplCode));
        });
      }
    })(function(tmpl) {
      function compile(contents, opts) {
        opts.contents = contents;
        return tmpl(opts);
      }

      if (gutil.isStream(file.contents)) {
        file.contents = es.pipeline(
          file.contents,
          es.wait(),
          es.map(function(data, callback) {
            callback(null, compile(data, opts));
          })
        );
      } else if (gutil.isBuffer(file.contents)) {
        file.contents = new Buffer(compile(String(file.contents), opts));
      }

      callback(null, file);
    });
  }

  return es.map(wrap);
};
