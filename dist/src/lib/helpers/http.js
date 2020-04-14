"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var http = require("http");
var http_1 = require("http");
var https = require("https");
var path = require("path");
var querystring = require("querystring");
var url = require("url");
var guid_1 = require("./guid");
var HttpResponse = /** @class */ (function (_super) {
    __extends(HttpResponse, _super);
    function HttpResponse() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(HttpResponse.prototype, "json", {
        get: function () {
            return JSON.parse(this.data);
        },
        enumerable: true,
        configurable: true
    });
    return HttpResponse;
}(http_1.IncomingMessage));
exports.HttpResponse = HttpResponse;
var HttpTypeRequest;
(function (HttpTypeRequest) {
    HttpTypeRequest["JSON"] = "application/json";
    HttpTypeRequest["FORM"] = "application/x-www-form-urlencoded";
})(HttpTypeRequest = exports.HttpTypeRequest || (exports.HttpTypeRequest = {}));
// tslint:disable-next-line:max-classes-per-file
var HttpClient = /** @class */ (function () {
    function HttpClient() {
    }
    HttpClient.get = function (uri, options) {
        if (options === void 0) { options = {}; }
        return new Promise(function (resolve, reject) {
            var body = "";
            var opt = url.parse(uri);
            opt.method = "GET";
            Object.assign(options, opt);
            var req = HttpClient.deferrer(uri)(opt, function (res) {
                if (options.raw) {
                    return resolve(res);
                }
                if (res.headers["content-type"]) {
                    var contentType = res.headers["content-type"];
                    switch (contentType) {
                        case "image/png":
                        case "image/jpg":
                        case "image/jpeg":
                            var baseTmp = options.tmpFolder ? options.tmpFolder : path.join(__dirname, "../tmp");
                            if (!fs.existsSync(baseTmp)) {
                                fs.mkdirSync(baseTmp);
                            }
                            var tmpFile = path.join(baseTmp, "img_tmp_" + guid_1.Guid.newGuid);
                            var file_1 = fs
                                .createWriteStream(tmpFile);
                            var stream = res.pipe(file_1);
                            stream.on("finish", function () {
                                var response = res;
                                response.file = fs.createReadStream(file_1.path);
                                response.file.on("end", function () {
                                    response.file.close();
                                    fs.unlinkSync(response.file.path);
                                });
                                return resolve(response);
                            });
                            break;
                        default:
                            res.setEncoding("utf-8");
                            res.on("data", function (d) {
                                body += d;
                            });
                            res.on("end", function () {
                                var response = res;
                                response.data = body;
                                return resolve(response);
                            });
                            res.on("error", function () {
                                return reject(res);
                            });
                            break;
                    }
                }
            });
            req.end();
        });
    };
    HttpClient.post = function (uri, data, type, opts) {
        if (type === void 0) { type = HttpTypeRequest.JSON; }
        return new Promise(function (resolve, reject) {
            var body = "";
            var dPost = "";
            var options = url.parse(uri);
            options.method = "POST";
            switch (type) {
                case HttpTypeRequest.JSON:
                    dPost = JSON.stringify(data);
                    break;
                case HttpTypeRequest.FORM:
                    dPost = querystring.stringify(data);
                    break;
            }
            if (opts) {
                Object.assign(options, opts);
            }
            if (!options.headers) {
                options.headers = {};
            }
            options.headers["Content-Length"] = Buffer.byteLength(dPost);
            options.headers["Content-Type"] = type.toString();
            var post = HttpClient.deferrer(uri)(options, function (res) {
                res.setEncoding("utf-8");
                res.on("data", function (d) {
                    body += d;
                });
                res.on("end", function () {
                    var response = res;
                    response.data = body;
                    return resolve(response);
                });
                res.on("error", function () {
                    return reject(res);
                });
            });
            post.write(dPost);
            post.end();
        });
    };
    HttpClient.deferrer = function (uri) {
        return uri.indexOf("https") > -1 ? https.request : http.request;
    };
    return HttpClient;
}());
exports.HttpClient = HttpClient;
