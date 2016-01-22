// Load plugins
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    css = require('gulp-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    mainBowerFiles = require('main-bower-files'),
    gulpFilter = require('gulp-filter'),
    order = require('gulp-order'),
    livereload = require('gulp-livereload'),
    del = require('del');

// Styles
gulp.task('styles', function() {
  return sass('frontend/styles/main.scss', { style: 'expanded' })
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest('dist/styles'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(css())
    .pipe(gulp.dest('dist/styles'))
    .pipe(notify({ message: 'Styles task complete' }));
});
// Dependencies
gulp.task('deps', ['scripts'], function(){
    var jsFiles = ['dist/scripts/main.min.js'];
    gulp.src(mainBowerFiles().concat(jsFiles))
        .pipe(gulpFilter('*.js'))
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/scripts'))
        .pipe(notify({ message: 'Dependencies injected to main script' }));
});
// Style dependencies
gulp.task('cssDeps', ['styles'], function() {
    var cssFiles = ['dist/styles/main.min.css'];
    gulp.src(mainBowerFiles().concat(cssFiles))
        .pipe(gulpFilter('*.css'))
        .pipe(order([
            '*'
        ]))
        .pipe(concat('main.min.css'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/styles'))
        .pipe(notify({ message: 'CSS Dependencies injected' }));

});
// Scripts
gulp.task('scripts', function() {
  return gulp.src(['!frontend/lib/**/*.js', 'frontend/**/*.js'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/scripts'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/scripts'))
    .pipe(notify({ message: 'Scripts task complete' }));
});
// Images
gulp.task('images', function() {
  return gulp.src('backend/resources/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/images'))
    .pipe(notify({ message: 'Images task complete' }));
});

// Clean
gulp.task('clean', function() {
  return del(['dist/styles', 'dist/scripts', 'dist/images']);
});

// Default task
gulp.task('default', ['clean'], function() {
  gulp.start('styles', 'cssDeps', 'scripts', 'deps', 'images');
});

// Development task
gulp.task('dev', function() {
  // Watch .scss files
  gulp.watch('frontend/styles/**/*.scss', ['styles']);
  // Watch .js files
  gulp.watch(['!frontend/lib/**/*.js' ,'frontend/**/*.js'], ['scripts']);
  // Watch image files
  gulp.watch('backend/resources/images/**/*', ['images']);
  //start server
  var exec = require('child_process').exec;
  var childServer = exec('node backend/app.js');
  childServer.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });
  childServer.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });
  childServer.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
  // Create LiveReload server
  livereload.listen();
  // Watch any files in dist/, reload on change
  gulp.watch(['dist/**']).on('change', livereload.changed);

});