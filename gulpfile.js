var gulp = require('gulp');

gulp.task('totest', function () {
    return gulp.src(['dist/**'])
        .pipe(gulp.dest('E:\\Projects\\angular\\ng-alain-sip\\node_modules\\sip-alain'));
});
