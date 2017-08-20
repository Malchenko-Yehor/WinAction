//  //////////////////////////////////////////
//  -----------------REQUIRED-----------------
//  //////////////////////////////////////////


var gulp = require('gulp');							            //gulp init
var sass = require('gulp-sass');					          //sass init
var browserSync = require('browser-sync').create();	//browser-sync init
var useref = require('gulp-useref');				        //useref init
var uglify = require('gulp-uglify');				        //uglify init
var gulpIf = require('gulp-if');					          //IF init
var cssnano = require('gulp-cssnano');				      //cssnano init
var imagemin = require('gulp-imagemin');			      //imagemin init
var cache = require('gulp-cache'); 					        //cache init
var del = require('del');							              //del init
var runSequence = require('run-sequence');			    //run-seq init
var bourbon = require('node-bourbon');				      //bourbon init
var autoprefixer = require('gulp-autoprefixer');    //autoprefixer init
var errorNotifier = require('gulp-error-notifier'); //error notifier init
var sourcemaps = require('gulp-sourcemaps');        //sourcemaps init
var plumber = require('gulp-plumber');              //plumber init

//  //////////////////////////////////////////
//  ------------------TASKS-------------------
//  //////////////////////////////////////////


// SAAS task
gulp.task('sass', function() {
  return gulp.src('dev/styles/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(errorNotifier())
    .pipe(sass({
		    includePaths: require('node-normalize-scss').includePaths
	   }).on('error', sass.logError))
    .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dev/styles/static'))
    .pipe(browserSync.reload({
      stream: true
    }))
});


//Browser Sync task
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'dev',
      index:"disklaimer.html"
    },
  })
})


//Useref task
gulp.task('useref', function(){
  return gulp.src('dev/*.html')
    .pipe(useref())
    // Minifies only if it's a JavaScript file
    .pipe(gulpIf('*.js', uglify()))
	// Minifies only if it's a CSS file
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
});


//Imagemin task
gulp.task('images', function(){
  return gulp.src('dev/styles/images/**/*.+(png|jpg|jpeg|gif|svg)')
  // Caching images that ran through imagemin
  .pipe(cache(imagemin({
      interlaced: true
    })))
  .pipe(gulp.dest('dist/styles/images'))
});


//Moving font files task
gulp.task('fonts', function() {
  return gulp.src('dev/styles/fonts/**/*')
  .pipe(gulp.dest('dist/styles/fonts'))
})

//Moving pages task
// gulp.task('pages', function() {
//   return gulp.src('dist/styles/*.html')
//   .pipe(gulp.dest('dist'))
// })


//Delete task
gulp.task('clean:dist', function() {
  return del.sync('dist');
})

//Clean unnecessary pages
// gulp.task('clean:pages', function() {
//   return del.sync('dist/styles/*.html');
// })


//Build task

gulp.task('build', function (callback) {
  runSequence('clean:dist',
    ['sass', 'useref', 'images', 'fonts',],
    // 'pages',
    // 'clean:pages',
    callback
  )
})


//  //////////////////////////////////////////
//  ------------------WATCH-------------------
//  //////////////////////////////////////////

gulp.task('watch', ['browserSync', 'sass'], function (){
  gulp.watch('dev/styles/**/*.scss', ['sass']);
  gulp.watch('dev/*.html', browserSync.reload);
  gulp.watch('dev/js/**/*.js', browserSync.reload);
});
