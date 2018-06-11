const gulp			= require("gulp"),
	babel					= require("gulp-babel"),
	browserSync 	= require("browser-sync").create(),
	cleanCSS 			= require('gulp-clean-css'),
	uglify				= require('gulp-uglify');

gulp.task("default", () => {
	return "No task selected.";
});

gulp.task("copy-html", () => {
	gulp.src("src/**/*.html")
		.pipe(gulp.dest("dist/"));
});

gulp.task("browser-sync", () => {
	browserSync.init({
		server: {
			baseDir: "./"
		}
	});
});

gulp.task("babel", () => {
	// current directory, even if it's a sub from root
	process.chdir(process.env.INIT_CWD);
	gulp.src("src/**/*.js")
		.pipe(babel())
		.on("error", (e) => {
			console.log(`Error: ${e.name}\nMessage: ${e.message}\nLine: ${e.loc.line} Col: ${e.loc.column}`);// handle error for babel
		})
		.pipe(gulp.dest("dist"));
});

gulp.task("watch-all", ["babel", "browser-sync"], () => {
	// https://css-tricks.com/gulp-for-beginners/#article-header-id-9
	gulp.watch(["src/**/*.js"], ["babel", browserSync.reload]);
	gulp.watch(["**/*.css"], browserSync.reload);
	gulp.watch(["**/*.html"], browserSync.reload);
});

gulp.task("watch-html", ["browser-sync"], () => {
	process.chdir(process.env.INIT_CWD);
	gulp.watch(["**/*.css"], browserSync.reload);
	gulp.watch(["**/*.html"], browserSync.reload);
});

gulp.task("watch-babel", ["babel"], () => {
	gulp.watch(["src/**/*.js"], ["babel"]);
});

/* for php */

// transpile + minify
gulp.task('php-babel', () => {
	process.chdir(process.env.INIT_CWD);
	gulp.src('./public_html/src/js/*.js')
		.pipe(babel())
		.on('error', (e) => {
			console.log(`Error: ${e.name}\nMessage: ${e.message}\nLine: ${e.loc.line} Col: ${e.loc.column}`);// handle error for babel
		})
		.pipe(gulp.dest('./public_html/dist/js'))
		.pipe(uglify())
		.pipe(gulp.dest('./public_html/dist/js'));
});

// minify
gulp.task('php-mincss', function () {
	process.chdir(process.env.INIT_CWD);
	return gulp.src('./public_html/src/css/style.css')
		.pipe(cleanCSS())
		.pipe(gulp.dest('./public_html/dist/css/'));
});


gulp.task('watch-php', ['php-babel', 'php-mincss'], () => {
	process.chdir(process.env.INIT_CWD);
	gulp.watch(['**/src/*/*.js'], ['php-babel']);
	gulp.watch(['**/src/*/*.css'], ['php-mincss']);
});



/* for js */

// css minify
gulp.task('jsmincss', function () {
	return gulp.src('./app/css/*.css')
		.pipe(cleanCSS())
		.pipe(gulp.dest('./dist'));
});

gulp.task('jsbabel', () => {
	gulp.src('./app/js/*.js')
		.pipe(babel())
		.on('error', (e) => {
			console.log(`Error: ${e.message}`);
		})
		.pipe(gulp.dest('./dist/'))
		.pipe(uglify())
		.pipe(gulp.dest('./dist/'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('jscopyhtml', () => {
	gulp.src('./app/index.html')
		.pipe(gulp.dest("./dist/"))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('jswatch', ['browser-sync'], () => {
	process.chdir(process.env.INIT_CWD);
	gulp.watch(['./app/css/*.css'], ['jsmincss', browserSync.reload]);
	gulp.watch(['./app/js/*.js'], ['jsbabel', browserSync.reload]);
	gulp.watch(['./app/index.html'], ['jscopyhtml', browserSync.reload]);
});
