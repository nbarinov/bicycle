var gulp = require('gulp'),
    sass = require('gulp-sass'),
    uglifyjs = require('gulp-uglifyjs'),
    cleanCSS = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin'),
    notify = require('gulp-notify'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload;

var paths = {
    html: ['source/*.html'],
    css: ['source/css/**/*.scss'],
    js: ['source/js/**/*.js'],
    fonts: ['source/fonts/**/*.*'],
    images: ['source/images/**/*.*'],
};

gulp.task('browserSync', function() {
    browserSync({
        server: {
            baseDir: './dist/',
        },
        port: 8080,
        open: true,
    });
});

gulp.task('html', function() {
    return gulp.src(paths.html)
        .pipe(gulp.dest('./dist/'))
        .pipe(reload({stream: true}));
});

gulp.task('css', function() {
    return gulp.src('source/css/style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(rename('bundle.css'))
        .pipe(gulp.dest('./dist/css/'))
        .pipe(notify('css saved'))
        .pipe(reload({stream: true}));
});

gulp.task('js', function() {
    return gulp.src('source/js/**/*.js')
        .pipe(uglifyjs())
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest('./dist/js/'))
        .pipe(notify('js saved'))
        .pipe(reload({stream: true}));
});

gulp.task('fonts', function() {
    return gulp.src(paths.fonts)
        .pipe(gulp.dest('./dist/fonts/'))
        .pipe(reload({stream: true}));
});

gulp.task('images', function() {
    return gulp.src(paths.images)
        .pipe(imagemin([
            imagemin.gifsicle({ interlaced: true }),
            imagemin.jpegtran({ progressive: true }),
            imagemin.optipng({ optimizationLevel: 5 }),
            imagemin.svgo({ plugins: [{ removeViewBox: true }] })
        ]))
        .pipe(gulp.dest('./dist/images/'))
        .pipe(reload({ stream: true }));
});

gulp.task('watcher', function() {
    gulp.watch(paths.html, ['html']);
    gulp.watch(paths.css, ['css']);
    gulp.watch(paths.js, ['js']);
    gulp.watch(paths.fonts, ['fonts']);
    gulp.watch(paths.images, ['images']);
});

gulp.task('default', ['watcher', 'browserSync']);