/* eslint-disable @typescript-eslint/no-require-imports */
'use strict';

var { src, watch, dest, series } = require('gulp');
var sass = require('gulp-sass')(require('sass'));

const sassBuild = (done) => {
  src('./_src/sass/**/*.scss')
    .pipe(sass({ outputStyle: 'expanded' }))
    .pipe(dest('./css'));
  done();
};

const watchScss = () => {
  watch('./_src/sass/**/*.scss', sassBuild);
};

exports.default = series(sassBuild, watchScss);
exports.build = sassBuild;
