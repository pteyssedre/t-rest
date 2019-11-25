"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var FileHelper = /** @class */ (function () {
    function FileHelper() {
    }
    FileHelper.copyFileAsync = function (sourcePath, destinationPath) {
        return new Promise(function (resolve) {
            var source = fs.createReadStream(sourcePath);
            var destination = fs.createWriteStream(destinationPath);
            source.pipe(destination);
            source.on("end", function () {
                return resolve(true);
            });
            source.on("error", function () {
                return resolve(false);
            });
        });
    };
    FileHelper.createFileAsync = function (filePath, content) {
        return new Promise(function (resolve, reject) {
            try {
                var folders = filePath.indexOf(path.sep) ? filePath.split(path.sep) : filePath.split("/");
                var compute = "";
                while (folders.length > 1) {
                    var f = folders.shift();
                    if (f) {
                        compute += (compute.length ? path.sep : "") + f;
                        if (!fs.existsSync(compute)) {
                            fs.mkdirSync(compute);
                        }
                    }
                }
                fs.appendFileSync(filePath, content);
            }
            catch (exception) {
                return reject(exception);
            }
            return resolve();
        });
    };
    return FileHelper;
}());
exports.FileHelper = FileHelper;
