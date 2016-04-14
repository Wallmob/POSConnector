var gulp = require("gulp");
var watch = require("gulp-watch");
var gulpJsdoc2md = require("gulp-jsdoc-to-markdown");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
var fileName = "POSConnector.js";

gulp.task("docs", function () {
	gulp.src(fileName)
    .pipe(gulpJsdoc2md())
    .pipe(rename("README.md"))
    .pipe(gulp.dest('./'));
});

gulp.task("compile-minify", function() {
	gulp.src(fileName)
	.pipe(uglify())
	.pipe(rename({extname: ".min.js"}))
	.pipe(gulp.dest("./"));
});

gulp.task("default", function () {
	gulp.start("docs");
    gulp.start("compile-minify");
    watch(fileName, function(files){
    	gulp.start("docs");
    	gulp.start("compile-minify");
    });
});

