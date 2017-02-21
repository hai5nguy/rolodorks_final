// Includes - Defining what will be used below.
// These are pulled in from the node_modules folder.
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var livereload = require('gulp-livereload');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var insert = require('gulp-insert');
var crlf = require ('gulp-line-ending-corrector');
//new stuff
var htmlmin = require('gulp-htmlmin');

// Basic error logging function to be used below
function errorLog (error) {
    console.error.bind(error);
    this.emit('end');
}

// Uglify JS - Targets all .js files in the _js folder and converts
// them to functionally identical code that uses less bytes in the _scripts folder
gulp.task('uglify', function () {
    gulp.src('src/js/*.js')
        .pipe(uglify())
        .on('error', errorLog)
        .pipe(insert.append('\n'))
        .pipe(crlf({eolc:'CRLF', encoding:'utf8'}))
        .pipe(gulp.dest('dist/js/'));
});

// Create expanded and .min versions of Sass styles in the _styles folder as CSS
gulp.task('sass', function () {
    gulp.src('src/sass/style.sass')
        .pipe(sass({ outputStyle: 'expanded' })
        .on('error', sass.logError))
        .pipe(crlf({eolc:'CRLF', encoding:'utf8'}))
        .pipe(gulp.dest('dist/css/'))
        .pipe(rename('style.min.css'))
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(crlf({eolc:'CRLF', encoding:'utf8'}))
        .pipe(gulp.dest('dist/css/'))
        .pipe(livereload());
});

// Lint the main.js file to ensure code consistency and catch any errors
gulp.task('lint', function() {
    return gulp.src('src/js/app.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Run a local server on port 8000
gulp.task('serve', function (done) {
    var express = require('express');
    var app = express();
    //path to the folder that will be served. __dirname is project root
    var path = 'dist/';
    app.use(express.static(path));
    app.listen(8000, function () {
         done();
    });
});

// Enable live reload listening from HTML files in the browser
// if you have the LiveReload browser extension installed.
gulp.task('html', function () {
    gulp.src('src/*.html')
        .pipe(livereload());
});

// Watch for changes in JS, Sass, and HTML files, then Lint,
// Uglify, Process the Sass, and reload the browser automatically
gulp.task('watch', function () {
  var server = livereload();
    gulp.watch('src/js/*.js', ['lint']);
    gulp.watch('src/js/*.js', ['uglify']);
    gulp.watch('src/sass/*.sass', ['sass']);
    gulp.watch('src/*.html', ['html']);

    livereload.listen();
});

// Automatically opens the local server in your default browser
gulp.task('open', function () {
    var url = 'http://localhost:8000';
    var OS = process.platform;
    var exectuable = '';

    //OS Specific values for opening files.
    if (OS == 'darwin') { executable = 'open ';     }
    if (OS == 'linux')  { executable = 'xdg-open '; }
    if (OS == 'win32')  { exectuable = 'explorer '; }

    //Run the OS specific command to open the url in the default browser
    require("child_process").exec( exectuable + url );
});

gulp.task('htmlmin', function () {
  gulp.src('src/*.html')
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(gulp.dest('dist/'))
})

// The default Gulp task that happens when you run gulp.
// It runs all the other gulp tasks above in the correct order.
gulp.task('default', ['sass', 'lint', 'uglify', 'htmlmin', 'watch', 'serve', 'open']);
