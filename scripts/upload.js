var http  = require('http');
var fs = require('fs');
var path = require('path');

function uploadFile (parmas) {
    if (!parmas.options) {
        console.error('options 必须输入!');
        return;
    } else if(!parmas.postData) {
        console.error('options 必须输入!');
        return;
    }

    var  options = parmas.options; 
    var  postData = parmas.postData;
    var  files = parmas.files; 
    var  callback = parmas.callback || function (res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.on("data", function(chunk) {
            console.log("BODY:" + chunk);
    })};
    function postFile(postData, files, req) {
        var boundaryKey = Math.random().toString(16);
        var enddata = '\r\n----' + boundaryKey + '--';
        var dataLength = 0;
    
        dataArr = Object.keys(postData);
    
        for (var i = 0; i < dataArr.length; i++) {
            var dataInfo = "\r\n----" + boundaryKey + "\r\n" + "Content-Disposition: form-data; name=\"" + dataArr[i] + "\"\r\n\r\n" + postData[dataArr[i]];
            var dataBinary = new Buffer(dataInfo, "utf-8");
            dataLength += dataBinary.length;
            postData[dataArr[i]] = dataInfo
        } 
    
        var filesArr = new Array();
        for (var i = 0; i < files.length; i++) {
            var content = "\r\n----" + boundaryKey + "\r\n" + "Content-Type: application/octet-stream\r\n" + "Content-Disposition: form-data; name=\"" + files[i].key + "\"; filename=\"" + path.basename(files[i].path) + "\"\r\n" + "Content-Transfer-Encoding: binary\r\n\r\n";
            var contentBinary = new Buffer(content, 'utf-8'); //当编码为ascii时，中文会乱码。
            filesArr.push({
                contentBinary: contentBinary,
                filePath: files[i].path
            });
        }
        var contentLength = 0;
        for (var i = 0; i < filesArr.length; i++) {
            var filePath = filesArr[i].filePath;
            if (fs.existsSync(filePath)) {
                var stat = fs.statSync(filePath);
                contentLength += stat.size;
            } else {
                contentLength += new Buffer("\r\n", 'utf-8').length;
            }
            contentLength += filesArr[i].contentBinary.length;
        }
    
        req.setHeader('Content-Type', 'multipart/form-data; boundary=--' + boundaryKey);
        req.setHeader('Content-Length', dataLength + contentLength + Buffer.byteLength(enddata));
    
        // 将参数发出
        Object.keys(postData).forEach(key => {
            req.write(postData[key])
        });
        
    
        var fileindex = 0;
        var doOneFile = function() {
            req.write(filesArr[fileindex].contentBinary);
            var currentFilePath = filesArr[fileindex].filePath;
            if (fs.existsSync(currentFilePath)) {
                var fileStream = fs.createReadStream(currentFilePath, {bufferSize: 4 * 1024});
                fileStream.pipe(req, {end: false});
                fileStream.on('end', function() {
                    fileindex++;
                    if (fileindex == files.length) {
                        req.end(enddata);
                    } else {
                        doOneFile();
                    }
                });
            } else {
                req.write("\r\n");
                fileindex++;
                if (fileindex == files.length) {
                    req.end(enddata);
                } else {
                    doOneFile();
                }
            }
        };
        if (fileindex == files.length) {
            req.end(enddata);
        } else {
            doOneFile();
        }
    }
    var req = http.request(options,callback)
    
    req.on('error', function(e) {
        console.log('problem with request:' + e.message);
        console.log(e);
    });

    postFile(postData, files, req);
    console.log("done");
}

module.exports = {  
    uploadFile: uploadFile
}