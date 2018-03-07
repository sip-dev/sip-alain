var gulp = require('gulp');

gulp.task('totest', function () {
    return gulp.src(['dist/**'])
        .pipe(gulp.dest('E:\\Projects\\sip-dev\\ng-sip\\node_modules\\sip-alain'));
});