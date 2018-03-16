var gulp = require('gulp');

// const destPath = 'E:\\Projects\\sip-dev\\ng-sip\\node_modules\\sip-alain';
const destPath = 'E:\\Projects\\bsip\\git\\sip\\sip-online\\node_modules\\sip-alain';

gulp.task('totest', function () {
    return gulp.src(['dist/**'])
        .pipe(gulp.dest(destPath));
});
