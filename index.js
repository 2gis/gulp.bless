
"use strict";

var path = require('path');
var through = require('through2');
var bless = require('bless4');
var gutil = require('gulp-util');

var PLUGIN_NAME = 'gulp.bless';

function blessify() {
    return through.obj(function(file, enc, cb) {
        if (file.isNull()) return cb(null, file);
        if (file.isStream()) return cb(new gutil.PluginError(PLUGIN_NAME, "Streaming not supported"));

        var result = bless(file.contents.toString());
        var stream = this;

        var names = result.data.map(function(conents, i) {
            if (i == 0) {
                return file.path;
            } else {
                var ext = path.extname(file.path);
                var basename = path.basename(file.path, ext);
                var dirname = path.dirname(file.path);

                return path.join(dirname, basename + '-blessed' + i + ext);
            }
        });

        if (names.length > 1) {
            var imports = names.slice(1).map(function(name) {
                var basename = path.basename(name);
                return '@import "' + basename + '";';
            });
            result.data[0] = result.data[0] + '\n' + imports.join('\n');
        }

        result.data.forEach(function(contents, i) {
            stream.push(new gutil.File({
                cwd: file.cwd,
                base: file.base,
                path: names[i],
                contents: new Buffer(contents)
            }));
        });

        cb();
    })
}

module.exports = blessify;