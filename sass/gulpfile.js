'use strict';

const { src, watch, dest, series } = require('gulp');
const gulpSass = require('gulp-sass');
const sass = require('sass');
const sassLint = require('gulp-sass-lint');
const sourcemaps = require('gulp-sourcemaps');

const compileSass = gulpSass(sass);

const sassBuild = (done) => {
  src('./_src/sass/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(
      sassLint({
        configFile: '.scss-lint.yml',
      })
    )
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError())
    .pipe(compileSass({ outputStyle: 'expanded' }))
    .pipe(sourcemaps.write('.')) // ソースマップをCSSファイルと同じディレクトリに出力
    .pipe(dest('./css'));
  done();
};

const watchScss = () => {
  watch('./_src/sass/**/*.scss', sassBuild);
};

exports.default = series(sassBuild, watchScss);
exports.build = sassBuild;
