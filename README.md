gulp.bless
==========
Gulp plugin for CSS Post-Processor Bless (based on 4.0.0-development branch)


Usage
=====

Very simple:


    var bless = require('gulp.bless');
    var concat = require('gulp-concat');

    gulp.src('css/ie/*.css')
      .pipe(concat('ie8.css'))
      .pipe(bless())
      .pipe(gulp.dest('build/assets'));
      
Differences from gulp-bless node package
===================================
This plugin uses the developer bless build version 4 (bless4 npm package), where there are no stupid bugs related to the malfunction of regular expressions for complex css files.
Version 4 works on the package css, which in turn uses the package css-parse that correctly handles even complex css files.
