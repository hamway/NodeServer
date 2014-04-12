/**
 * Created by hamway on 03.04.14.
 */

var gulp      = require('gulp'),
    rename    = require('gulp-rename'),
    concat    = require('gulp-concat'),
    jsmin     = require('gulp-jsmin'),
    less      = require('gulp-less'),
    cssmin    = require('gulp-minify-css'),
    concatCss = require('gulp-concat-css'),
    clean     = require('gulp-clean'),
    notify    = require("gulp-notify"),
    debug     = require("gulp-debug");

var dirs = {
    build:      'build/',
    buildJS:    'build/js/',
    buildCSS:   'build/css/',
    components: 'static/components/',
    static:     'static/',
    staticJS:   'static/javascripts/',
    staticCSS:  'static/stylesheets/',
    public:     'public/',
    publicJS:   'public/js/',
    publicCSS:  'public/css/',
    publicIMG:  'public/img/'
};

var jsLibs = [
    dirs.components + 'jquery/dist/jquery.min.js',
    dirs.components + 'bootstrap/docs/assets/js/bootstrap.min.js'
];

var buildsJS = [];


var buildCss = [
    dirs.components + 'bootstrap/docs/assets/css/bootstrap.css',
    dirs.components + 'bootstrap/docs/assets/css/bootstrap-responsive.css'
];

var buildLess = [];

var BuildCopy = {
    js: [
        dirs.components + 'bootstrap/docs/assets/js/html5shiv.js'
    ]
};

var cssMinifyOpts = {
    keepBreaks: true,
    removeEmpty: true,
    keepSpecialComments: true
};

gulp.task('default', function() {
    gulp.start('scripts', 'styles', 'status')
    ;
});

gulp.task('publish', function() {
    gulp.start('concat', 'compress', 'public');
});

gulp.task('scripts', function() {
    if (buildsJS.length != 0)
        gulp.src(buildsJS)
            .pipe(gulp.dest(dirs.buildJS))
        ;
});

gulp.task('styles', function() {
    gulp.src(buildCss)
        .pipe(gulp.dest(dirs.buildCSS))
    ;

    if (buildLess.length != 0)
        gulp.src(buildLess)
            .pipe(less())
            .pipe(gulp.dest(dirs.buildCSS))
        ;
});

gulp.task('concat', function() {

    jsLibs = jsLibs.concat([dirs.buildJS + '*.js'])

    gulp.src(jsLibs)
        .pipe(concat('all.js'))
        .pipe(gulp.dest(dirs.build))
    ;

    gulp.src(dirs.buildCSS + '*.css')
        .pipe(concatCss('all.css'))
        .pipe(gulp.dest(dirs.build))
    ;
});

gulp.task('compress', function(){
    gulp.src(dirs.build + 'all.css')
        .pipe(cssmin(cssMinifyOpts))
        .pipe(rename(function(path) {
            path.basename += '.min';
        }))
        .pipe(gulp.dest(dirs.build));

    gulp.src(dirs.build + 'all.js')
        //.pipe(jsmin())
        .pipe(rename(function(path) {
            path.basename += '.min';
        }))
        .pipe(gulp.dest(dirs.build));

});

gulp.task('public', function() {
    gulp.src(dirs.build + 'all.min.js')
        .pipe(gulp.dest(dirs.publicJS))
    ;

    gulp.src(dirs.components + 'jquery/dist/jquery.min.map')
        .pipe(gulp.dest(dirs.publicJS))
    ;

    gulp.src(BuildCopy.js)
        .pipe(gulp.dest(dirs.publicJS))
    ;

    gulp.src(dirs.build + 'all.min.css')
        .pipe(gulp.dest(dirs.publicCSS))
    ;

    gulp.src(dirs.components + 'bootstrap/img/*.png')
        .pipe(gulp.dest(dirs.publicIMG))
    ;

    gulp.src(dirs.static + 'images/*.png')
        .pipe(gulp.dest(dirs.publicIMG))
    ;

    gulp.src(dirs.static + 'favicon.ico')
        .pipe(gulp.dest(dirs.public))
        .pipe(notify('Build complete'))
    ;
});

gulp.task('status', function() {
    gulp.src([
        dirs.staticCSS + 'style.less',
        dirs.staticCSS + 'chart.less'])
        .pipe(less())
        .pipe(cssmin(cssMinifyOpts))
        .pipe(concat('status.min.css'))
        .pipe(gulp.dest(dirs.publicCSS));

    gulp.src(dirs.staticJS + 'status.js')
        .pipe(jsmin())
        .pipe(rename(function(path){
            path.basename += '.min';
        }))
        .pipe(gulp.dest(dirs.publicJS));
});

gulp.task('clean', function() {
   gulp.start('cleanBuilds');
});

gulp.task('destroy', function(){
    gulp.start('cleanBuilds', 'cleanPublic');
});

gulp.task('cleanBuilds', function() {
    var cleanDirs = [
        dirs.buildJS + '*.js',
        dirs.buildCSS + '*.css',
        dirs.build + 'all*.js',
        dirs.build + 'all*.css',
    ];
    gulp.src(cleanDirs, {read:false}).pipe(clean());
});

gulp.task('cleanPublic', function() {
    gulp.src(dirs.publicIMG, {read:false}).pipe(clean());
    gulp.src(dirs.publicCSS, {read:false}).pipe(clean());
    gulp.src(dirs.publicJS, {read:false}).pipe(clean());
    gulp.src(dirs.public + 'favicon.ico', {read:false}).pipe(clean());
});
