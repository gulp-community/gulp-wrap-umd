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
Default: `['require', 'exports', 'module']`

The dependencies to import or require.

#### options.params

Type: `Array`
Default: `['require', 'exports', 'module']`

The parameter names to assign your dependencies to in the factory function.

#### options.exports

Type: `String`
Default: `null`

The variable to return (export) from your factory function.  This can be used in situations where you need to return and defined namespace.

#### options.namespace

Type: `String`
Default: `gulpWrapUmd`

The namespace in which the file contents will be assigned. Use dot notation (e.g. App.Templates) for nested namespaces.

## LICENSE

MIT License

Copyright (c) 2013 Blaine Bublitz

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
