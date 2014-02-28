[![Build Status](https://travis-ci.org/phated/gulp-wrap-umd.png?branch=master)](https://travis-ci.org/phated/gulp-wrap-umd)

# gulp-wrap-umd

Wrap files with an UMD wrapper

## Usage

First, install gulp-wrap-umd as a development dependency:

```bash
npm install --save-dev gulp-wrap-umd
```

Then, add it to your `gulpfile.js`:

```js
var wrap = require('gulp-wrap-umd');

gulp.task('umd', function(){
  gulp.src(['client/templates/*.js'])
    .pipe(wrap({
      namespace: 'MyApp.templates'
     }))
    .pipe(gulp.dest('build/js/'));
});
```

## API

### wrap(options)

#### options.deps

Type: `Array`

Default: `['require', 'exports', 'module']` (depends on template, implemented in default template)

The dependencies to import or require.

Starting from 0.2.0, you can use extended `deps` syntax for setting custom names/paths for different targets and parameter names right in `deps` items like below:
```javascript
[
    {name: 'jquery', globalName: 'jQuery', paramName: '$' /* , cjsName: ..., amdName: ... */},
    'jade',
    {name: 'lodash', globalName: '_', amdName: '../lodash'}
]
```
...so you would get:
```javascript
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(["jquery", "jade", "../lodash"], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('jquery'), require('jade'), require('lodash'));
    } else {
        root.test = factory(root.jQuery, root.jade, root._);
    }
}(this, function($, jade, _) {
    // ...
}));
```

##### extended deps configuration

```js
{
  name: '' // default name for any properties that aren't set
  globalName: '', // global namespace to attach to
  paramName: '', // parameter name for the wrapper function
  amdName: ''; // module name for the AMD dependency
  cjsName: ''; // module name for the CJS dependency
}
```

#### options.params (deprecated)

Type: `Array`

Default: `['require', 'exports', 'module']`

The parameter names to assign your dependencies to in the factory function.

When set, is used as `paramName` values from `deps` where missing (left for backward compatibility).

#### options.exports

Type: `String`

Default: `null`

The variable to return (export) from your factory function.  This can be used in situations where you need to return a defined namespace.

#### options.namespace

Type: `String`

Default: `gulpWrapUmd`

The namespace in which the file contents will be assigned. Use dot notation (e.g. App.Templates) for nested namespaces.

#### options.template

Type: `String`

Default: The UMD template

The template to use to generate the output files. Can be passed a Lo-Dash template string as a custom template.

## LICENSE

MIT License

Copyright (c) 2014 Blaine Bublitz

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
