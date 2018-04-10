const gulp = require("gulp"),
	babel = require("gulp-babel"),
	browserSync = require("browser-sync").create();

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
		.on("error", () => {}) // handle error for babel
		.pipe(gulp.dest("dist"));
});

gulp.task("watch-all", ["babel", "browser-sync"], () => {
	// https://css-tricks.com/gulp-for-beginners/#article-header-id-9
	gulp.watch(["src/**/*.js"], ["babel", browserSync.reload]);
	gulp.watch(["src/**/*.css"], browserSync.reload);
	gulp.watch(["src/**/*.html"], ["copy-html", browserSync.reload]);
});

gulp.task("watch-html", ["babel", "browser-sync"], () => {
	gulp.watch(["**/*.js"], ["babel", browserSync.reload]);
	gulp.watch(["**/*.css"], browserSync.reload);
	gulp.watch(["**/*.html"], browserSync.reload);
});

gulp.task("watch-babel", ["babel"], () => {
	gulp.watch(["src/**/*.js"], ["babel"]);
});

