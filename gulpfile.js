const gulp = require('gulp');
const sass = require('gulp-sass');
const babel = require('gulp-babel');

sass.compiler = require('node-sass');

function css() {
return gulp.src('./sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
};

function react(){
    gulp.src('./public/src/index.jsx')
		.pipe(babel({
			presets: ['@babel/preset-env']
		}))
		.pipe(gulp.dest('dist'));
}

function watch() {    
    gulp.watch("./public/src/**/*.jsx", react);
    gulp.watch('./public/sass/**/*.scss', css);
};
  
exports.default = gulp.series(css, react, watch);