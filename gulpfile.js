const gulp = require('gulp');
const sass = require('gulp-sass');
const webpack = require('webpack-stream');

sass.compiler = require('node-sass');

function css() {
    return gulp.src('./public/src/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./public/css'));
};

function react() {
    return gulp.src('./public/src/index.jsx')
        .pipe(webpack({
            module: {
                rules: [{
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: ['@babel/preset-react']
                        }
                    }
                }]
            },
            output: {
                filename: "index.js"
            },
            resolve: {
                extensions: ['.js', '.jsx']
            },
            mode: 'development',
            // node: {
            //     fs: 'empty',
            //     net: 'empty'
            //   }

        }))
        .pipe(gulp.dest('./public/dist'));
}

function watch() {
    gulp.watch("./public/src/**/*.jsx", react);
    gulp.watch('./public/src/sass/**/*.scss', css);
};

exports.default = gulp.series(css, react, watch);