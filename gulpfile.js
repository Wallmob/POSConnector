var gulp = require("gulp");
var watch = require("gulp-watch");
var gulpJsdoc2md = require("gulp-jsdoc-to-markdown");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
var fileName = "POSConnector.js";

function docs() {
	return gulp.src(fileName)
		.pipe(gulpJsdoc2md())
		.pipe(rename("README.md"))
		.pipe(gulp.dest('./'));
}

function compileMinify() {
	return gulp.src(fileName)
		.pipe(uglify())
		.pipe(rename({extname: ".min.js"}))
		.pipe(gulp.dest("./"));
}

function defaultTasks() {
	docs();
    compileMinify();
    return watch(fileName, function(files){
    	docs();
    	compileMinify();
    });
}

exports.docs = docs;
exports.compileMinify = compileMinify;
exports.default = defaultTasks;
