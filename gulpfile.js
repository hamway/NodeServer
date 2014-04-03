/**
 * Created by hamway on 03.04.14.
 */

var gulp = require('gulp'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    concatCss = require('gulp-concat-css'),
    clean = require('gulp-clean'),
    notify = require("gulp-notify");

var dirs = {
    build: './build/',
    buildJS: './build/js/',
    buildCSS: './build/css/',
    components: './public/components/',
    publicJS: './public/javascripts/',
    publicCSS: './public/stylesheets/',
    publicIMG: './public/img/'
};

var buildsJS = [
    dirs.components + 'jquery/dist/jquery.min.js',
    dirs.components + 'bootstrap/docs/assets/js/bootstrap.min.js'
    //dirs.components + 'bootstrap/docs/assets/js/html5shiv.js'
];

var builsCss = [
    dirs.components + 'bootstrap/docs/assets/css/bootstrap.css',
    dirs.components + 'bootstrap/docs/assets/css/bootstrap-responsive.css'
];

gulp.task('default', function() {

    gulp.src(buildsJS)
        .pipe(gulp.dest(dirs.buildJS))
        .pipe(concat('all.min.js'))
        .pipe(gulp.dest(dirs.build))
        .pipe(gulp.dest(dirs.publicJS))
    ;

    gulp.src(dirs.components + 'jquery/dist/jquery.min.map')
        .pipe(gulp.dest(dirs.publicJS));

    gulp.src(builsCss).pipe(gulp.dest(dirs.buildCSS))
        .pipe(concatCss('all.min.css'))
        .pipe(gulp.dest(dirs.build))
        .pipe(gulp.dest(dirs.publicCSS))
        //.pipe(notify("Build complete!!!"))
    ;

    gulp.src(dirs.components + 'bootstrap/img/*.png')
        .pipe(gulp.dest(dirs.publicIMG));
});

gulp.task('clean', function() {
    gulp.src(dirs.build, {read:false}).pipe(clean());
});

gulp.task('cleanAll', function() {
    gulp.src(dirs.build, {read:false}).pipe(clean());
    gulp.src(dirs.publicIMG, {read:false}).pipe(clean());
    gulp.src(dirs.publicCSS + 'all.min.css', {read:false}).pipe(clean());
    gulp.src(dirs.publicJS + 'all.min.js', {read:false}).pipe(clean());
    gulp.src(dirs.publicJS + 'jquery.min.map', {read:false}).pipe(clean());
});
