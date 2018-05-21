'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    styleCompile = require('gulp-less'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    cssmin = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload,
    babel = require('gulp-babel'),
    less = require('gulp-less'),
    livereload = require('gulp-livereload');

var path = {
    build: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: 'public/',
        htaccess: 'public/',
        php: 'public/',
        php2: 'public/assets/php/',
        js: 'public/assets/js/',
        css: 'public/assets/styles/',
        img: 'public/assets/images/',
        fonts: 'public/assets/fonts/',
        video: 'public/assets/video/',
        panos: 'public/assets/panos/'
    },
    src: { //Пути откуда брать исходники
        html: 'source/**/*.html',
        htaccess: 'source/.htaccess', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        php: 'source/**/*.php', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        php2: 'source/assets/php/*.php',
        js: 'source/assets/js/scripts.js',//В стилях и скриптах нам понадобятся только main файлы
        js_standalone: 'source/assets/js/standalone/**/*.js',
        swf_standalone: 'source/assets/js/standalone/**/*.swf',
        style: 'source/assets/styles/styles.less',
        styles_standalone: 'source/assets/styles/standalone/*.less',
        styles_standalone_css: 'source/assets/styles/standalone/*.css',
        img: 'source/assets/images/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        fonts: 'source/assets/fonts/**/*.*',
        video: 'source/assets/video/**/*.*',
        panos: 'source/assets/panos/**/*.*'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: 'source/**/*.html',
        htaccess: 'source/.htaccess',
        php: 'source/**/*.php',
        php2: 'source/assets/php/**/*.php',
        js: 'source/assets/js/**/*.js',
        style: 'source/assets/styles/**/*.less',
        img: 'source/assets/images/**/*.*',
        fonts: 'source/assets/fonts/**/*.*',
        video: 'source/assets/video/**/*.*',
        panos: 'source/assets/panos/**/*.*'
    },
    clean: './public'
};

var config = {
    server: {
        baseDir: "/public"
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "Frontend_Devil"
};

gulp.task('html:build', function () {
    gulp.src(path.src.html) //Выберем файлы по нужному пути
        .pipe(rigger()) //Прогоним через rigger
        .pipe(gulp.dest(path.build.html)) //Выплюнем их в папку build
        .pipe(reload({stream: true}))
        .pipe(livereload()); //И перезагрузим наш сервер для обновлений
});
gulp.task('php:build', function () {
    gulp.src(path.src.php) //Выберем файлы по нужному пути
        .pipe(rigger()) //Прогоним через rigger
        .pipe(gulp.dest(path.build.php)) //Выплюнем их в папку build
        .pipe(reload({stream: true}))
        .pipe(livereload()); //И перезагрузим наш сервер для обновлений
    gulp.src(path.src.php2) //Выберем файлы по нужному пути
        .pipe(rigger()) //Прогоним через rigger
        .pipe(gulp.dest(path.build.php2)) //Выплюнем их в папку build
        .pipe(reload({stream: true}))
        .pipe(livereload()); //И перезагрузим наш сервер для обновлений
});

gulp.task('js:build', function () {
    gulp.src(path.src.js) //Найдем наш main файл
        .pipe(rigger()) //Прогоним через rigger
        // .pipe(uglify()) //Сожмем наш js
        .pipe(gulp.dest(path.build.js)) //Выплюнем готовый файл в build
        .pipe(reload({stream: true}))
        .pipe(livereload()); //И перезагрузим сервер

        gulp.src(path.src.js_standalone) //Найдем наш main файл
        .pipe(rigger()) //Прогоним через rigger
        // .pipe(uglify()) //Сожмем наш js
        .pipe(gulp.dest(path.build.js)) //Выплюнем готовый файл в build
        .pipe(reload({stream: true}))
        .pipe(livereload()); //И перезагрузим сервер

        gulp.src(path.src.swf_standalone) //Найдем наш main файл
        .pipe(gulp.dest(path.build.js)) //Выплюнем готовый файл в build
        .pipe(reload({stream: true}))
        .pipe(livereload()); //И перезагрузим сервер
});
gulp.task('styles:build', function () {
    gulp.src(path.src.style) //Выберем наш main.scss
        .pipe(rigger())
        .pipe(styleCompile()) //Скомпилируем
        .pipe(prefixer()) //Добавим вендорные префиксы
        .pipe(cssmin()) //Сожмем
        .pipe(gulp.dest(path.build.css)) //И в build
        .pipe(reload({stream: true}))
        .pipe(livereload());

        gulp.src(path.src.styles_standalone) //Выберем наш main.scss
        .pipe(rigger())
        .pipe(styleCompile()) //Скомпилируем
        .pipe(prefixer()) //Добавим вендорные префиксы
        .pipe(cssmin()) //Сожмем
        .pipe(gulp.dest(path.build.css)) //И в build
        .pipe(reload({stream: true}))
        .pipe(livereload());

    gulp.src(path.src.styles_standalone_css) //Выберем наш main.scss
        .pipe(rigger())
        .pipe(prefixer()) //Добавим вендорные префиксы
        .pipe(cssmin()) //Сожмем
        .pipe(gulp.dest(path.build.css)) //И в build
        .pipe(reload({stream: true}))
        .pipe(livereload());


});
gulp.task('images:build', function () {
    gulp.src(path.src.img) //Выберем наши картинки
        .pipe(imagemin({ //Сожмем их
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img)) //И бросим в build
        .pipe(reload({stream: true}))
        .pipe(livereload());
});
gulp.task('video:build', function () {
    gulp.src(path.src.video) //Выберем наши картинки
        .pipe(gulp.dest(path.build.video)) //Выплюнем их в папку build
        .pipe(reload({stream: true}))
        .pipe(livereload()); //И перезагрузим наш сервер для обновлений
});
gulp.task('panos:build', function () {
    gulp.src(path.src.panos) //Выберем наши картинки
        .pipe(gulp.dest(path.build.panos)) //Выплюнем их в папку build
        .pipe(reload({stream: true}))
        .pipe(livereload()); //И перезагрузим наш сервер для обновлений
});
gulp.task('htaccess:build', function () {
    gulp.src(path.src.htaccess) //Выберем наши картинки
        .pipe(gulp.dest(path.build.htaccess)) //Выплюнем их в папку build
        .pipe(reload({stream: true}))
        .pipe(livereload()); //И перезагрузим наш сервер для обновлений
});
gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts)).pipe(livereload());
});
gulp.task('build', [
    'html:build',
    'php:build',
    'js:build',
    'styles:build',
    'fonts:build',
    'images:build',
    'video:build',
    'panos:build',
    'htaccess:build'

]);
gulp.task('watch', function(){
    livereload.listen();
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build').on('change', livereload.changed);
    });
    watch([path.watch.php], function(event, cb) {
        gulp.start('php:build').on('change', livereload.changed);
    });
    watch([path.watch.php2], function(event, cb) {
        gulp.start('php:build').on('change', livereload.changed);
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('styles:build').on('change', livereload.changed);
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build').on('change', livereload.changed);
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('images:build').on('change', livereload.changed);
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build').on('change', livereload.changed);
    });
    watch([path.watch.panos], function(event, cb) {
        gulp.start('panos:build').on('change', livereload.changed);
    });
    watch([path.watch.video], function(event, cb) {
        gulp.start('video:build').on('change', livereload.changed);
    });
    watch([path.watch.htaccess], function(event, cb) {
        gulp.start('htaccess:build').on('change', livereload.changed);
    });
});
gulp.task('webserver', function () {
    browserSync(config);
});
gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});
gulp.task('default', ['build', 'webserver', 'watch']);