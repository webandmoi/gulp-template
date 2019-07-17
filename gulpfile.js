const gulp = require("gulp");
const plumber = require("gulp-plumber");
const browserSync = require("browser-sync");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const minifycss = require("gulp-minify-css");
const sourcemaps = require("gulp-sourcemaps");
const babel = require("gulp-babel");

const srcPath = "src/";
const distPath = "dist/";

/* ========================================
	watch
======================================== */
gulp.task("watch", () => {
  gulp.watch(srcPath + "html/*.html", ["copy", "reload"]);
  gulp.watch([srcPath + "sass/**"], function() {
    gulp.start(["sass"]);
  });
  gulp.watch(srcPath + "js/**", ["copy", "babel"]);
  gulp.watch(srcPath + "img/**/*", ["copy", "reload"]);
});

/* ========================================
	browser-sync
======================================== */
gulp.task("browser-sync", () => {
  browserSync({
    port: 8888,
    open: "external",
    ghostMode: false,
    browser: ["google chrome"],
    server: {
      baseDir: distPath,
      index: "index.html"
    }
  });
});

/* ========================================
	sass
======================================== */
gulp.task("sass", () => {
  gulp
    .src(srcPath + "sass/bundle.scss")
    .pipe(plumber())
    .pipe(autoprefixer())
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(minifycss())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(distPath + "css"))
    .pipe(browserSync.stream());
});

/* ========================================
	babel
======================================== */
gulp.task("babel", () => {
  gulp
    .src([srcPath + "js/**/*"])
    .pipe(
      babel({
        presets: ["es2015"]
      })
    )
    .pipe(gulp.dest(distPath + "js/"));
});

/* ========================================
  copy
======================================== */
gulp.task("copy", () => {
  gulp.src([srcPath + "html/**/*"]).pipe(gulp.dest(distPath));

  gulp.src([srcPath + "img/**/*"]).pipe(gulp.dest(distPath + "img"));

  gulp.src([srcPath + "js/lib/**/*"]).pipe(gulp.dest(distPath + "js/lib"));
});

/* ========================================
  reload
======================================== */
gulp.task("reload", () => {
  browserSync.reload();
});

/* ========================================
  start
======================================== */
gulp.task("default", ["copy", "sass", "babel", "browser-sync", "watch"]);
