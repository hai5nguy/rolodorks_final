// Includes - Defining what will be used below.
// These are pulled in from the node_modules folder.
var gulp = require('gulp');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var insert = require('gulp-insert');
var crlf = require ('gulp-line-ending-corrector');
var htmlmin = require('gulp-htmlmin');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var babelify = require('babelify');
var notify     = require("gulp-notify");
//new stuff for the gulp file goes below
var imagemin = require('gulp-imagemin');
var babel = require('gulp-babel');
var livereload = require('gulp-livereload');
var util = require('gulp-util');
var eslint = require('gulp-eslint');
var open = require('gulp-open');
var os = require('os');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var reactTools = require('react-tools');
//Not currently being used


var dependencies = [
	'react',
  	'react/addons'
  ]
// Basic error logging function to be used below
function errorLog (error) {
    console.error.bind(error);
    this.emit('end');
}


// Uglify JS - Targets all .js files in the _js folder and converts
// them to functionally identical code that uses less bytes in the _scripts folder
gulp.task('uglify', function () {
 //     gulp.src('src/js/*.js')
 // 	 .pipe(sourcemaps.init({loadMaps: true}))
 // 	 .pipe(uglify())
 // 	 .on('error', errorLog)
 // 	 .pipe(insert.append('\n'))
 // 	 .pipe(crlf({eolc:'CRLF', encoding:'utf8'}))
 // 	 .pipe(sourcemaps.write('.'))
 // 	 .pipe(gulp.dest('dist/js/'));
 // });
	//index.jsx is the entry point for the src file
		gulp.src('src/js/**/*.js').pipe(require('gulp-reactify')({
			reactTools: require('reactTools')
		}))
				//create a sourcemap for the folders
				.pipe(sourcemaps.init({loadMaps: true}))
				.pipe(concat('index.js'))
        .pipe(uglify())
        // .on('error', errorLog)
        // .pipe(insert.append('\n'))
        // .pipe(crlf({eolc:'CRLF', encoding:'utf8'}))
				.pipe(sourcemaps.write('../dist/js/'))
				.pipe(gulp.dest('../dist/js/'))
})
// Create a task that optimizes images and the folder structure
gulp.task('img', function (source) {
  return gulp.src('src/images/**/*')
    .pipe(imagemin({
      progressive: true}))
    .pipe(gulp.dest('dist/images/'))
});

// Create expanded and .min versions of Sass styles in the _styles folder as CSS
gulp.task('sass', function () {
    gulp.src('src/scss/rook.scss')
				.pipe(sourcemaps.init())
				.on('error', sass.logError)
				.pipe(sass({ outputStyle: 'expanded' }))
				.pipe(crlf({eolc:'CRLF', encoding:'utf8'}))
        .pipe(gulp.dest('dist/css/'))
        .pipe(rename('index.css'))
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(crlf({eolc:'CRLF', encoding:'utf8'}))
				.pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/css/'))
        .pipe(livereload())
});

// Run a local server on port 8000
gulp.task('serve', function (done) {
    var express = require('express');
    var app = express();
    //path to the folder that will be served. __dirname is project root
    var path = 'dist/';
    app.use(express.static(path));
    app.use('*', express.static(__dirname + '/dist/index.html'))
    app.listen(8000, function () {
         done();
    });
});

// Enable live reload listening from HTML files in the browser
// if you have the LiveReload browser extension installed.
gulp.task('html', function () {
    gulp.src('src/*.html')
      .pipe(gulp.dest('dist/'))
      .pipe(livereload())
      .pipe(notify({message: 'HTML task complete'}));
});

// Watch for changes in JS, Sass, and HTML files, then Lint,
// Uglify, Process the Sass, and reload the browser automatically
gulp.task('watch', function () {
  var server = livereload();
    // gulp.watch('src/js/**/*.{js,jsx}', ['lint']);
    // gulp.watch('src/js/**/*.{js,jsx}', ['uglify']);
    gulp.watch('src/js/**/*.{js,jsx}', ['js', 'lint']);
    gulp.watch('src/scss/**/*.scss', ['sass']);
    gulp.watch('src/*.html', ['html']);
    livereload.listen();
});

// Automatically opens the local server in your default browser
gulp.task('open', function () {
	//OS Specific values for opening files.
	console.log(os.platform())
	var browser = os.platform() === 'linux' ? 'google-chrome' : (
		os.platform() === 'darwin' ? '/Applications/Google\ Chrome.app' : (
		os.platform() === 'win32' ? 'chrome' : 'firefox'));
    var options = {
			uri: 'http://localhost:8000',
			app: browser};
		gulp.src(__filename)
			.pipe(open(options));
});

gulp.task('htmlmin', function () {
  gulp.src('src/*.html')
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(gulp.dest('dist/'))
});

// New, still working this out
gulp.task('js', function () {
  browserify({
    entries: [ './src/js/index.js'],
    extensions: ['.js', '.jsx'],
    require: dependencies,
    debug: true //Add sourcemaps
  })
  .transform(babelify) // JSX and ES6 => JS
  .bundle()
	.pipe(source('index.js')) //Desired filename of bundled files
	.on('error', console.error.bind(console))
  .on("error", notify.onError({
    message: 'Error: <%= error.message %>',
    sound: "Sosumi"}))
  .pipe(gulp.dest('./dist/js/'))
	.pipe(livereload())
});

gulp.task('lint', () => {
    // ESLint ignores files with "node_modules" paths.
    // Otherwise, the task may end before the stream has finished.
    return gulp.src(['src/js/**/*.{js,jsx}','!node_modules/**'])
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console.
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        .pipe(eslint.failAfterError());
});

// The default Gulp task that happens when you run gulp.
// It runs all the other gulp tasks above in the correct order.
//took off: 'babel','uglify',
gulp.task('default', [ 'html', 'img', 'sass', 'js', 'watch', 'serve', 'open']);
