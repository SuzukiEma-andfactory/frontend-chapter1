'use strict';

const { src, watch, dest, series, parallel } = require('gulp');
const gulpSass = require('gulp-sass');
const sass = require('sass');
const sassLint = require('gulp-sass-lint');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const path = require('path');

const compileSass = gulpSass(sass);

// Sassをコンパイルしてブラウザをリロード
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
    .pipe(dest('./css'))
    .pipe(browserSync.stream()); // xSassをコンパイル後にブラウザを更新
  done();
};

// `browser-sync` を設定してブラウザを自動で開く
const serve = (done) => {
  browserSync.init({
    server: {
      baseDir: path.resolve(__dirname, '_src/sass/section10'),
      // css/section10/sass/style.cssにアクセス
      routes: {
        '/css': path.resolve(__dirname, 'css'),
      },
    },
    open: true, // ブラウザを自動で開く
    notify: false, // リロード時の通知をオフにする
  });
  done();
};

// ファイル変更を監視してリロード
const watchFiles = () => {
  watch('./_src/sass/**/*.scss', sassBuild); // SCSS変更時にコンパイル
  watch('./*.html').on('change', browserSync.reload); // HTML変更時にリロード
  watch('./css/**/*.css').on('change', browserSync.reload); // CSS変更時にリロード
};

exports.default = series(sassBuild, parallel(serve, watchFiles));
exports.build = sassBuild;
