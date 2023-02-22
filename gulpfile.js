"use strict";

let {src, dest, watch, series} = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const cleanCss = require("gulp-clean-css");
const sourcemaps = require("gulp-sourcemaps");
const imagemin = require("gulp-imagemin");
const browserSync = require("browser-sync").create();
const ghPages = require("gh-pages");

// SCSS to CSS
function style(){
    // Find SCSS main file (./src)
    // (./scss/**/*.scss */) --> Look for all folders inside scss main folder that are a .scss file
    return src("./src/css/style.scss")
        // Compile SCSS to CSS
        .pipe(sass().on("error", sass.logError))
        // Initialize sourcemaps
        .pipe(sourcemaps.init())
        // Minify CSS
        .pipe(cleanCss({
            compatibility: 'ie8'
        }))
        // Initialize sourcemaps
        .pipe(sourcemaps.write())
        // Save compiled CSS into ./dist
        .pipe(dest("./dist"))
        // Reload changes
        .pipe(browserSync.stream());
};

// HTML file(s)
function html(){
    return src("./src/*.html")
	    .pipe(dest("./dist"));
};

// Images
function images(){
    return src("./src/img/*")
        // Compress images
        .pipe(imagemin())
	    .pipe(dest("./dist/img/"));
};

// Fonts
function fonts(){
    return src("./src/fonts/*")
	    .pipe(dest("./dist/fonts/"));
};

// Watch changes on files
function watchTasks(){
    browserSync.init({
        server: {
            baseDir: "./dist",
        },
        notify: false
    });
    watch("./src/*.html", html).on("change", browserSync.reload);
	watch("./src/css/*", style);
	watch("./src/fonts/*", fonts);
	watch("./src/img/*", images);
};

// Deploy project via GitHub pages
function deploy(){
    return ghPages.publish("dist");
};

exports.deploy = deploy;
exports.default = series(
    style,
    html,
    images,
    fonts,
    watchTasks
);
