var gulp = require('gulp'),
	coffee = require('gulp-coffee'),
	watch = require('gulp-watch'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename');

gulp.task('compile-minify', function() {
	gulp.src('POSConnector.coffee')
	.pipe(coffee({bare: true}))
	.pipe(gulp.dest('./'))
	.pipe(uglify())
	.pipe(rename({extname: '.min.js'}))
	.pipe(gulp.dest('./'));
});

gulp.task('watch', function () {
    watch('POSConnector.coffee', function(files){
    	gulp.start('compile-minify');
    });
});
