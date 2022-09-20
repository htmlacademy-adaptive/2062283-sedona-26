import gulp from 'gulp';
import plumber from 'gulp-plumber';
import less from 'gulp-less';
import postcss from 'gulp-postcss';
import csso from 'postcss-csso';
import rename from 'gulp-rename';
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';
import imagemin from 'gulp-imagemin';
import webp from 'gulp-webp';
import svgSprite from 'gulp-svg-sprite';

// Styles

export const styles = () => {
  return gulp.src('source/less/style.less', { sourcemaps: true })
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

// Images

export const optimizeImages = () => {
 return gulp.src('source/img/**/*.{jpeg,jpg,png,svg}')
    .pipe(imagemin())
    .pipe(gulp.dest('build/img'))
}

const copyImages = () => {
  return gulp.src('source/img/**/*.{jpeg,jpg,png,svg}')
    .pipe(gulp.dest('build/img'));
}

// WebP

export const createWebp = () => {
 return gulp.src('source/img/**/*.{jpg,png}')
        .pipe(webp())
        .pipe(gulp.dest('build/img'))
}

// Sprite

export const sprite = () => {
  return gulp.src('source/img/**/*.svg')
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: 'sprite.svg',
        },
      },
    }))
    .pipe(rename({
      dirname: './'
    }))
    .pipe(gulp.dest('build/img'))
}

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Watcher

const watcher = () => {
  gulp.watch('source/less/**/*.less', gulp.series(styles));
  gulp.watch('source/*.html').on('change', browser.reload);
}


export default gulp.series(
  styles, server, watcher
);
