// Define dependencies:
var gulp = require('gulp'),
    // CSS-specific:
    //sass = require('gulp-sass'), // broken on OSX
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    // JS-specific:
    uglify = require('uglify-js'),  // Harmony branch for ES6 support
    minifier = require('gulp-uglify/minifier'),
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
var outputDir = '.';

/*
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
*/

var my3rdPartyOrderedScripts = [
    'js/3rdparty/polyline.js',
    'js/3rdparty/zepto.min.js',
    'js/3rdparty/zepto.fx.js',
    'js/3rdparty/zepto.animate.js',
    'js/3rdparty/zepto.selector.js'
];
// Take javascripts, concatenate them, rename, minify, save:
gulp.task('scripts1', function(callback) {
    var options = {
        preserveComments: 'license'
    };
    return pump([                       // produces nicer errors
        gulp.src(my3rdPartyOrderedScripts),
        concat('3rdparty.js'),
        gulp.dest(outputDir + '/js'),
        size(),
        minifier(options, uglify),      // can handle ES6
        rename({suffix: '.min'}),
        gulp.dest(outputDir + '/js'),
        size(),
        notify({ message: 'Scripts1 task complete' })
    ], callback);
});

var myOrderedScripts = [
    'js/ajax_requests.js',
    'js/renderer.js',
    'js/mapping.js',
    'js/behaviours.js',
    'js/filters.js'
];
// Take javascripts, concatenate them, rename, minify, save:
gulp.task('scripts2', function(callback) {
    var options = {
        preserveComments: 'license'
    };
    return pump([                       // produces nicer errors
        gulp.src(myOrderedScripts),
        concat('app.js'),
        gulp.dest(outputDir + '/js'),
        size(),
//        minifier(options, uglify),      // removed because it mishandles ES6
//        rename({suffix: '.min'}),
//        gulp.dest(outputDir + '/js'),
//        size(),
        notify({ message: 'Scripts2 task complete' })
    ], callback);
});


// Compress images and cache them:
gulp.task('images', function() {
    return gulp.src(['img/*.png', 'img/*.jpg', 'img/*.svg'])
    .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest(outputDir + '/img'))
    .pipe(size())
    .pipe(notify({ message: 'Images task complete' }));
});

/*
// Inject Gulped css & js into main html file:
gulp.task('inject1', function () {
    var sources = gulp.src([
        outputDir + '/js/3rdparty.min.js',
        outputDir + '/css/app.min.css'
    ], {read: false});

    return gulp.src('templates/header.inc.php')
    .pipe(inject(sources, {relative: true, ignorePath: 'dist/'}))
    .pipe(gulp.dest('templates/'))
    .pipe(size());
});
// Inject Gulped css & js into main html file:
gulp.task('inject2', function () {
    var sources = gulp.src([
        outputDir + '/js/app.min.js'
    ], {read: false});

    return gulp.src('templates/footer.inc.php')
    .pipe(inject(sources, {relative: true, ignorePath: 'dist/'}))
    .pipe(gulp.dest('templates/'))
    .pipe(size());
});
*/

// Watch files for changes:
gulp.task('watch', function() {
    // Watch .scss files
    // gulp.watch('css/app.scss', ['styles']);
    // Watch .js files
    gulp.watch('js/*.js', ['scripts2']);

    // Create LiveReload server
    livereload.listen();
    // Watch any files in dist/, reload on change
    gulp.watch(['dist/**']).on('change', livereload.changed);
});
