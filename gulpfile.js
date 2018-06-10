const gulp			= require("gulp"),
	babel					= require("gulp-babel"),
	browserSync 	= require("browser-sync").create(),
	csso 					= require('gulp-csso'),
	uglify				= require('gulp-uglify'),
	autoprefixer	= require('gulp-autoprefixer');

// supported browsers
const AUTOPREFIXER_BROWSERS = [
	'ie >= 10',
	'ie_mob >= 10',
	'ff >= 30',
	'chrome >= 34',
	'safari >= 7',
	'opera >= 23',
	'ios >= 7',
	'android >= 4.4',
	'bb >= 10'
];

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
		.pipe(autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
		.pipe(csso())
		.pipe(gulp.dest('./public_html/dist/css/'));
});


gulp.task('watch-php', ['php-babel', 'php-mincss'], () => {
	process.chdir(process.env.INIT_CWD);
	gulp.watch(['**/src/*/*.js'], ['php-babel']);
	gulp.watch(['**/src/*/*.css'], ['php-mincss']);
});


/* for js */

gulp.task('jswatch', ['browser-sync'], () => {
	// https://css-tricks.com/gulp-for-beginners/#article-header-id-9
	process.chdir(process.env.INIT_CWD);

	gulp.watch(['./app/js/*.js'], () => {
		gulp.src('./app/js/*.js')
			.pipe(babel())
			.on('error', (e) => {
				console.log(`Error: ${e.name}\nMessage: ${e.message}\nLine: ${e.loc.line} Col: ${e.loc.column}`);// handle error for babel
			})
			.pipe(gulp.dest('./dist/'))
			.pipe(uglify())
			.pipe(gulp.dest('./dist/'))
			.pipe(browserSync.reload({
				stream: true
			}));
	});

	gulp.watch(['./app/css/*.css'], () => {
		gulp.src('./app/css/*.css')
			.pipe(autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
			.pipe(csso())
			.pipe(gulp.dest('./dist/'))
			.pipe(browserSync.reload({
				stream: true
			}));
	});

	gulp.watch(['./app/index.html'], () => {
		gulp.src('./app/index.html')
			.pipe(gulp.dest("./dist/"))
			.pipe(browserSync.reload({
				stream: true
			}));
	});
});
