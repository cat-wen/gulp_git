var gulp=require("gulp");
var uglify=require("gulp-uglify");
var cssmin=require("gulp-minify-css");
var htmlmin=require("gulp-htmlmin");
var scssmin=require("gulp-sass");
var concat=require("gulp-concat");
var webserver = require('gulp-webserver'); //web服务热启动
var browserify = require('gulp-browserify');
var url = require("url");
var data = require("./data.js");
var rev = require('gulp-rev'); //- 对文件名加MD5后缀
var revCollector = require('gulp-rev-collector'); //- 路径替换
gulp.task("jsmin",function(){
    gulp.src("src/js/*.js")
        //.pipe(concat())
        .pipe(browserify({
            insertGlobals: true,
            debug: !gulp.env.production
        }))
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest("bound/js/"))
        .pipe(rev.manifest()) //- 生成一个rev-manifest.json
        .pipe(gulp.dest('./rev/js')); //将re-manifest.json存放到的路径
});
gulp.task("htmlmin",function(){
    gulp.src("src/demo/*.html")
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest("bound/demo"))
});
gulp.task("cssmin",function(){
    gulp.src("src/css/*.sass")
        .pipe(scssmin())
        .pipe(cssmin())
        .pipe(gulp.dest("bound/css"))
});
gulp.task('replaceRev', ["jsmin"], function() {
    setTimeout(function() {
        gulp.src(['./rev/*.json', './src/*.html'])
            .pipe(revCollector({
                replaceReved: true,
                dirReplacements: {
                    'css': 'css/',
                    'js': 'js/'
                }
            }))
            .pipe(gulp.dest('./bound'));
    }, 2000)
});
gulp.task("server", ["jsmin", "cssmin", "htmlmin"], function() {
    gulp.watch("./src/demo/*.html", ["htmlmin"]);
    gulp.watch("./src/css/*.sass", ["cssmin"]);
    gulp.watch("./src/js/*.js", ["jsmin"]);
    // setTimeout(function() {
    gulp.src('./bound')
        .pipe(webserver({
            port:8025,
            livereload: true,
            directoryListing: true,
            middleware: function(req, res, next) {
                var pathName = url.parse(req.url).pathname;
                data.forEach(function(i) {
                    switch (i.route) {
                        case pathName: {
                            i.handle(req, res, next, url)
                        }
                        break;
                    }
                })
                res
            },
             open: "/demo/index.html"
        }));
    // }, 300)
});