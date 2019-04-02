// ```javascript
// !/usr/bin/env node
// console.log('cli');
// ```

var fs = require("fs");
var path = require("path");
var diff = require('diff-match-patch');
var zipper = require("zip-local");

console.log('start RN_PacthPacker');

var argvs = process.argv.splice(2);

var oldFile = argvs[0];
var newFile = argvs[1];
var patchFile = argvs[2];
patchFile = patchFile + "/" + process.env.npm_package_name + ".patch"

console.log('common:', oldFile);
console.log('bundle', newFile);
console.log('diffpatch', patchFile);

if (!oldFile || !newFile || !patchFile) {
    console.log('传入参数错误：' + argvs);
    return;
}
var oldtext = readFile(oldFile);
var newtext = readFile(newFile);

var ms_start = (new Date()).getTime();

var patchText = make_patch_text(oldtext, newtext);
writeFile(patchFile, patchText);
var ms_end = (new Date()).getTime();
console.log('end RN_PacthPacker');
console.log('Time: ' + (ms_end - ms_start) / 1000 + 's');

function readFile(filePath) {
    // 同步读取
    var data = fs.readFileSync(filePath);
    return data.toString();
}

function writeFile(filePath, text) {
    createFolder(filePath);
    fs.writeFile(filePath, text, function(err){
        if (err){
            return console.error(err);
        } else {
            // zipping a file
            zipper.zip(filePath, function(error, zipped) {
                if(!error) {
                    zipped.compress(); // compress before exporting

                    var buff = zipped.memory(); // get the zipped file as a Buffer

                    // or save the zipped file to disk
                    zipped.save((filePath.replace('.patch','')) + ".zip", function(error) {
                        if(!error) {
                            console.log("saved successfully !");
                        } else {
                            console.log('error:' + error)
                        }
                    });
                } else {
                    console.log('error:' + error)
                }
            });
        }
    });
}

function make_patch_text(oldText, newText) {
    var dmp = new diff.diff_match_patch();
    var patches = dmp.patch_make(oldText, newText);
    var patch_toText = dmp.patch_toText(patches);
    return patch_toText;
}

function createFolder(to) { //文件写入
    var sep = path.sep;
    var folders = path.dirname(to).split(sep);
    var p = '';
    while (folders.length) {
        p += folders.shift() + sep;
        if (!fs.existsSync(p)) {
            fs.mkdirSync(p);
        }
    }
};