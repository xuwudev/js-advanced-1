const gulp = require("gulp")
const htmlMin = require("gulp-htmlmin")
const concat = require("gulp-concat")
const minify = require("gulp-minify")
const cleanCSS = require("gulp-clean-css")
const clean = require("gulp-clean")
const browserSync = require("browser-sync").create()
const sass = require("gulp-sass")(require("sass"))

const html = () => {
  return gulp
    .src("./src/*.html")
    .pipe(htmlMin({ collapseWhitespace: true }))
    .pipe(gulp.dest("./dist"))
}

const js = () => {
  return gulp
    .src("./src/scripts/**/*.js")
    .pipe(concat("script.js"))
    .pipe(
      minify({
        ext: {
          src: ".js",
          min: ".min.js",
        },
      })
    )
    .pipe(gulp.dest("./dist/scripts"))
}

const css = () => {
  return gulp
    .src("./src/styles/**/*.css")
    .pipe(concat("style.css"))
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(gulp.dest("./dist/styles"))
}

const scss = () => {
  return gulp
    .src("./src/styles/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(concat("style.css"))
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(gulp.dest("./dist/styles"))
}

const cleanDist = () => {
  return gulp.src("./dist", { read: false }).pipe(clean())
}

const watcher = () => {
  gulp.watch("./src/**/*.html", html).on("all", browserSync.reload)

  gulp
    .watch("./src/styles/**/*.{scss, sass, css}", scss)
    .on("all", browserSync.reload)

  gulp.watch("./src/scripts/*.js", js).on("all", browserSync.reload)

  // gulp.watch('./src/images/**/*.*', image).on('all', browserSync.reload);
}

const server = () => {
  browserSync.init({
    server: {
      baseDir: "./dist",
    },
  })
}

// const image = () => {
//   return gulp.src('./src/images/**/*.*')
//       .pipe(imageMin())
//       .pipe(gulp.dest('./dist/images'))
// };

gulp.task("html", html)
gulp.task("script", js)
gulp.task("style", css)
gulp.task("browser-sync", server)
gulp.task("scss", scss)
// gulp.task('image', image)

gulp.task("build", gulp.series(cleanDist, gulp.parallel(html, scss, js)))

gulp.task(
  "dev",
  gulp.series(gulp.parallel(html, scss, js), gulp.parallel(server, watcher))
)
