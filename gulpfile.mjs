import gulp from "gulp";
import dartSass from "sass";
import gulpSass from "gulp-sass";
const sassCompiler = gulpSass(dartSass);
import concat from "gulp-concat";
import uglify from "gulp-uglify";
import cleanCSS from "gulp-clean-css";
import imagemin from "gulp-imagemin";
import { deleteAsync as del } from "del";
import browserSync from "browser-sync";

const paths = {
  html: "public/index.html", // Main HTML file
  assets: ["public/**/*", "!public/index.html"], // All static assets except index.html
  styles: "styles/**/*.scss", // All Sass files
  scripts: "src/**/*.js", // All JavaScript files
  dist: "docs/", // Distribution folder
};

export function clean() {
  return del([paths.dist]);
}

export function html() {
  return gulp.src(paths.html).pipe(gulp.dest(paths.dist));
}

export function copyAssets() {
  return gulp.src(paths.assets).pipe(gulp.dest(paths.dist));
}

export function styles() {
  return gulp
    .src(paths.styles)
    .pipe(sassCompiler().on("error", sassCompiler.logError))
    .pipe(cleanCSS())
    .pipe(gulp.dest(paths.dist + "css"));
}

export function scripts() {
  // Concatenate all JS files into index.js at the root of dist to match your HTML
  return gulp
    .src(paths.scripts)
    .pipe(concat("index.js"))
    .pipe(uglify())
    .pipe(gulp.dest(paths.dist));
}

export function images() {
  // Optimize images (if needed)
  return gulp
    .src("public/images/**/*")
    .pipe(imagemin())
    .pipe(gulp.dest(paths.dist + "images"));
}

export function watchFiles() {
  browserSync.init({ server: { baseDir: paths.dist } });
  gulp.watch(paths.styles, styles);
  gulp.watch(paths.scripts, scripts);
  gulp.watch(paths.html, html).on("change", browserSync.reload);
  gulp.watch(paths.assets, copyAssets).on("change", browserSync.reload);
}

export const build = gulp.series(
  clean,
  gulp.parallel(html, copyAssets, styles, scripts)
);

export default gulp.series(build, watchFiles);
