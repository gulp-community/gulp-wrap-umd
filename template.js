;(function() {
  var undefined;

  var objectTypes = {
    'function': true,
    'object': true
  };

  var root = (objectTypes[typeof window] && window) || this;

  var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;

  var freeModule = objectTypes[typeof module] && module && !module.nodeType && module

  var moduleExports = freeModule && freeModule.exports === freeExports && freeExports;

  var freeGlobal = objectTypes[typeof global] && global;
  if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal)) {
    root = freeGlobal;
  }

  var _ = root._;

  var templates = {};

  templates['umd'] = function(obj) {
    obj || (obj = {});
    var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
    function print() { __p += __j.call(arguments, '') }
    with (obj) {

    var stdDeps = ['require', 'exports', 'module'];

    var amdDeps = _.pluck(deps, 'amdName');
    var globalDeps = _.map(deps, function(dep) { return dep.globalNameString ? dep.globalName : 'root.' + dep.globalName });
    var cjsDeps = deps ? _.map(deps, function(dep) { return "require('" + dep.cjsName + "')" }) : stdDeps;
    var depNames = deps ? _.pluck(deps, 'paramName') : stdDeps;
    __p += '\n(function(root, factory) {\n  if (typeof define === \'function\' && define.amd) {\n    define(' +
    ((__t = ( deps ? JSON.stringify(amdDeps) + ', ' : '' )) == null ? '' : __t) +
    'factory);\n  } else if (typeof exports === \'object\') {\n    module.exports = factory(' +
    ((__t = ( cjsDeps.join(', ') )) == null ? '' : __t) +
    ');\n  } else {\n    root.' +
    ((__t = ( namespace )) == null ? '' : __t) +
    ' = factory(' +
    ((__t = ( globalDeps.join(', ') )) == null ? '' : __t) +
    ');\n  }\n}(this, function(' +
    ((__t = ( depNames.join(', ') )) == null ? '' : __t) +
    ') {\n';
     if (exports) {
    __p += '\n' +
    ((__t = ( contents )) == null ? '' : __t) +
    '\nreturn ' +
    ((__t = ( exports )) == null ? '' : __t) +
    ';\n';
     } else {
    __p += '\nreturn ' +
    ((__t = ( contents )) == null ? '' : __t) +
    ';\n';
     }
    __p += '\n}));\n';

    }
    return __p
  };

  if (freeExports && freeModule) {
    _ = require('lodash');
    if (moduleExports) {
      (freeModule.exports = templates).templates = templates;
    }
  }
}.call(this));
