// Define dependencies:
var gulp = require('gulp'),
    // CSS-specific:
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    // JS-specific:
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    pump = require('pump'),
    // IMG-specific:
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    // HTML-specific:
    inject = require('gulp-inject'),
    // General:
    gutil = require('gulp-util'),
    changed = require('gulp-changed'),
    rename = require('gulp-rename'),
    size = require('gulp-size'),
    notify = require('gulp-notify'),
    livereload = require('gulp-livereload'),
    del = require('del');

var outputDir = './dist';

// Pre-process CSS, autoprefix them, rename, minify, save:
gulp.task('styles', function() {
    return gulp.src('css/app.scss')
    .pipe(changed(outputDir))            	// ignore unchanged input files
    .pipe(sass({sourceComments: 'map'}))	// processes Sass to css
    .pipe(autoprefixer(['> 0.5% in GB', 'last 2 versions']))  // which browsers to prefix CSS for
    .pipe(gulp.dest('./css'))				// saves out non-minified .css
    .pipe(gulp.dest(outputDir + '/css'))  	// saves out non-minified .css into dist
    .pipe(size())
    .pipe(cssnano())                		// minifies
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(outputDir + '/css'))  // saves out minified .css into dist
    .pipe(size())
    .pipe(notify({ message: 'Styles task complete' }));
});


var myOrderedScripts = [
    'js/3rdparty/polyline.js',
    'js/3rdparty/zepto.min.js',
    'js/3rdparty/zepto.fx.js',
    'js/3rdparty/zepto.animate.js',
    'js/app.src.js'
];
// Take javascripts, concatenate them, rename, minify, save:
gulp.task('scripts', function(callback) {
    //return pump([                       // produces nicer errors
        return gulp.src(myOrderedScripts)
        .pipe(concat('main.js'))
        .pipe(gulp.dest(outputDir + '/js'))
        .pipe(size())
        .pipe(uglify({mangle: false})).on('error', gutil.log)
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(outputDir + '/js'))
        .pipe(size())
        .pipe(notify({ message: 'Scripts task complete' }));
    //], callback);
});


// Compress images and cache them:
gulp.task('images', function() {
    return gulp.src(['img/*.png', 'img/*.jpg'])
    .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest(outputDir + '/img'))
    .pipe(size())
    .pipe(notify({ message: 'Images task complete' }));
});


// Inject Gulped css & js into main html file:
gulp.task('inject', function () {
    var sources = gulp.src([
        outputDir + '/js/main.min.js',
        outputDir + '/css/app.min.css'
    ], {read: false});

    return gulp.src('templates/header.inc.php')
    .pipe(inject(sources, {relative: true, ignorePath: 'dist/'}))
    .pipe(gulp.dest('templates/'))
    .pipe(size());
});


// Clean distribution build:
gulp.task('clean', function() {
    return del([
        '**/.DS_Store',
        'dist/assets/css',
        'dist/assets/js',
        'dist/assets/img'
    ]);
});

/*
// Watch files for changes:
gulp.task('watch', function() {
    // Watch .scss files
    gulp.watch('css/taskapp.scss', ['styles']);
    // Watch .js files
    gulp.watch('js/taskapp.js', ['scripts']);
    // Watch image files
    gulp.watch('img/*', ['images']);
    // Watch html files
    gulp.watch('taskapp.html', ['html']);

    // Create LiveReload server
    livereload.listen();
    // Watch any files in dist/, reload on change
    gulp.watch(['dist/**']).on('change', livereload.changed);
});
*/

// Run 'clean' first, then run 'styles'/'scripts'/'images' concurrently:
gulp.task('assets', ['clean'], function() {
    gulp.start('styles', 'scripts', 'images');
});


// Build all assets then inject into html:
gulp.task('default', ['assets'], function() {
    gulp.start('inject');
});
