'use strict';

var through = require('through2');
var _ = require('lodash');
var PluginError = require('gulp-util').PluginError;

var tmpls = require('./template');

function normalizeDeps(deps, params){
  return _.map(deps, function(dep, idx){
    function paramName(){
      return params ? params[idx] : (dep.name || dep);
    }

    var out = {};
    if(typeof dep === 'string'){
      out.name = dep;
      out.globalName = dep;
      out.paramName = paramName();
      out.amdName = dep;
      out.cjsName = dep;
    } else {
      out.name = dep.name;
      out.globalName = dep.globalName || dep.name;
      out.paramName = dep.paramName || paramName();
      out.amdName = dep.amdName || dep.name;
      out.cjsName = dep.cjsName || dep.name;
    }

    return out;
  });
}

function getOptions(file, opts){
  opts = _.defaults(_.clone(opts) || {}, {
    deps: null,
    params: null,
    exports: null,
    namespace: 'gulpWrapUmd',
    file: file
  });

  if(opts.deps){
    opts.deps = normalizeDeps(opts.deps, opts.params);
  }

  return opts;
}

module.exports = function(options){

  var tmpl = tmpls.umd;
  if(options && options.template){
    tmpl = _.template(options.template);
  }

  function compile(contents, opts) {
    opts.contents = contents;
    return tmpl(opts);
  }

  function WrapUMD(file, enc, cb){
    var opts = getOptions(file, options);

    if(file.isStream()){
      this.emit('error', new PluginError('gulp-wrap-umd', 'Streaming not supported'));
      return cb();
    }

    if(file.isBuffer()){
      file.contents = new Buffer(compile(String(file.contents), opts));
    }

    this.push(file);
    cb();
  }

  return through.obj(WrapUMD);
};
