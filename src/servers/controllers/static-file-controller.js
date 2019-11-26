"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var http_1 = require("../../lib/helpers/http");
var mime = require("mime-types");
var StaticFileController = /** @class */ (function () {
    function StaticFileController(server, props) {
        var _this = this;
        this.props = props;
        this.mainPath = props.filePath;
        server.get("/*", function (req, res) {
            try {
                if (_this.props.proxy) {
                    var data = Object.keys(_this.props.proxy);
                    var p_1 = req.path();
                    var match = data.filter(function (e) { return p_1.indexOf(e) === 0; }).shift();
                    if (match) {
                        return _this.proxify(_this.props.proxy[match], req, res);
                    }
                }
                return _this.matchFile(req, res);
            }
            catch (e) {
                console.error("[StaticFileController]", e.message);
                return res.send(404);
            }
        });
    }
    StaticFileController.prototype.matchFile = function (req, res) {
        var isFile = new RegExp("/.*\\.css|.*\\.html|.*\\.js|.*\\.png|.*\\.ico|.*\\.jpeg|.*\\.jpg|.*\\.woff|.*\\.woff2|.*\\.ttf/");
        var p = this.props.defaultFile ? this.props.defaultFile : "index.html";
        if (isFile.test(req.path())) {
            p = req.path();
        }
        var filePath = path.join(this.mainPath, p);
        if (!fs.existsSync(filePath)) {
            return res.send(404);
        }
        var stat = fs.statSync(filePath);
        res.writeHead(200, {
            "Content-Length": stat.size,
            "Content-Type": mime.lookup(p),
        });
        var readStream = fs.createReadStream(filePath);
        readStream.pipe(res);
    };
    StaticFileController.prototype.proxify = function (proxyElement, req, res) {
        var q = req.getQuery();
        var uri = "" + proxyElement.target + req.path() + (q ? "?" + q : "");
        return http_1.HttpClient.get(uri, { raw: true })
            .then(function (response) {
            res.writeHead(Number(response.statusCode), response.headers);
            return response.pipe(res);
        }).catch(function (error) {
            return res.send(500, error.message);
        });
    };
    return StaticFileController;
}());
exports.StaticFileController = StaticFileController;
