var gulp = require("gulp");
var del = require("del");
var sass = require("gulp-sass");
var sourcemaps = require('gulp-sourcemaps');
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var mincss = require("gulp-csso");
var rename = require("gulp-rename");
var server = require("browser-sync").create();
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var svgmin = require("gulp-svgmin");
var svgstore = require("gulp-svgstore");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var htmlmin = require("gulp-htmlmin");
var uglify = require('gulp-uglify');

// удаление папки build
gulp.task("clean", function () {
    return del("build");
});

// копирование файлов в папку build
gulp.task("copy", function () {
    return gulp.src([
        "source/fonts/**/*.{woff,woff2}",
        "source/img/**",
        "source/js/**",
        "source/*.html"
    ], {
        base: "source"
    })
    .pipe(gulp.dest("build"));
});

// компиляция, автопрефиксы и минификация css
gulp.task("style", function () {
    return gulp.src("source/scss/style.scss")
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([ 
            autoprefixer()
        ]))
        .pipe(gulp.dest("build/css"))
        .pipe(sourcemaps.write('./'))
        .pipe(mincss())
        .pipe(rename("style.min.css"))
        .pipe(gulp.dest("build/css"))
        .pipe(server.stream());
})

// минификация изображений
gulp.task("images", function () {
    return gulp.src("source/img/**/*.{png,jpg,svg}")
        .pipe(imagemin([
            imagemin.optipng({optimizationLevel: 3}),
            imagemin.mozjpeg({progressive: true}),
            imagemin.svgo()
        ]))
    .pipe(gulp.dest("source/img"));
})

// создание изображений в формате webp
gulp.task("webp", function () {
    return gulp.src("source/**/*.{png,jpg}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("source"));
})

// сборка спрайта
gulp.task("sprite", function () {
    return gulp.src("source/img/icon-*.svg")
        .pipe(svgmin())
        .pipe(svgstore({
            inlineSVG: true
        }))
        .pipe(rename("sprite.svg"))
        .pipe(gulp.dest("build/img"));
});

// вставка спрайта и минификация html
gulp.task("html", function () {
    return gulp.src("source/*.html")
        .pipe(posthtml([
            include()
        ]))
        .pipe(htmlmin({ 
            collapseWhitespace: true,
            ignoreCustomFragments: [ /<br>\s/gi ]
        }))
        .pipe(gulp.dest("build"));
});

// минификация js
gulp.task("js", function () {
    return gulp.src("source/js/*.js")
        .pipe(uglify())
        .pipe(gulp.dest("build/js"));
});

// создание сервера и отслеживание изменений
gulp.task ("server", function() {
    server.init({
        server: "build/"
    });
    gulp.watch("source/scss/**/*.scss", gulp.series("style"));
    gulp.watch("source/*.html", gulp.series("html", "refresh"));
    gulp.watch("source/img/icon-*.svg", gulp.series("sprite", "html", "refresh"));
    gulp.watch("source/js/script.js", gulp.series("refresh"));
});

// перезагрузка страницы
gulp.task("refresh", function (done) {
    server.reload();
    done();
});

// favicons
gulp.task("favicons:del", function() {
    return del("build/img/favicons");
});
  
gulp.task("favicons:copy", function() {
    return gulp.src("source/img/favicons/*.{png,jpg,json,jpeg,svg}")
        .pipe(gulp.dest("build/img/favicons/"));
});

gulp.task('favicons', gulp.series("favicons:del", "favicons:copy"));

gulp.task("build", gulp.series("clean", "copy", "style", "sprite", "html", "js", "favicons"));
gulp.task("start", gulp.series("build", "server"));