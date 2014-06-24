
var assert = require('assert');
var fs = require('fs');
var path = require('path');
var through = require('through2');
var File = require('vinyl');
var bless = require('../');
var css = require('css');

function normalizeCss(data) {
    return css.stringify(css.parse(data));
}

describe("gulp.bless", function() {
    var inpath = path.join(__dirname, 'css');
    var outpath = path.join(inpath, 'out');
    var files = fs.readdirSync(inpath);

    files.forEach(function(filename) {
        if (path.extname(filename) != '.css') return;

        var basename = path.basename(filename);

        it(basename, function(done) {
            var filepath = path.join(inpath, filename);
            var stream = through.obj();

            var file = new File({
                path: filepath,
                contents: fs.readFileSync(filepath)
            });

            stream
                .pipe(bless())
                .pipe(through.obj(function(file, enc, cb) {

                    var basename = path.basename(file.path);
                    var expected = path.join(outpath, basename);
                    assert(fs.existsSync(expected), "Out file " + basename + " must exists.");

                    var expectedData = fs.readFileSync(expected).toString();
                    assert.equal(normalizeCss(expectedData), normalizeCss(file.contents.toString()), "Blessed css for " + basename + " must be valid");
                    cb();
                }))
                .on('finish', function() {
                    done();
                });

            stream.write(file);
            stream.end();
        });
    });
});