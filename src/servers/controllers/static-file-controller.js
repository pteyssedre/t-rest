"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var mime = require("mime-types");
var StaticFileController = /** @class */ (function () {
    function StaticFileController(server, props) {
        var _this = this;
        this.props = props;
        this.mainPath = props.filePath;
        server.get("/*", function (req, res) {
            return _this.matchFile(req, res);
        });
    }
    StaticFileController.prototype.matchFile = function (req, res) {
        var isFile = new RegExp("/.*\\.css|.*\\.html|.*\\.js|.*\\.png|.*\\.ico|.*\\.jpeg|.*\\.jpg|.*\\.woff|.*\\.woff2|.*\\.ttf/");
        var p = this.props.defaultFile ? this.props.defaultFile : "index.html";
        if (isFile.test(req.path())) {
            p = req.path();
        }
        var filePath = path.join(this.mainPath, p);
        var stat = fs.statSync(filePath);
        res.writeHead(200, {
            "Content-Length": stat.size,
            "Content-Type": mime.lookup(p),
        });
        var readStream = fs.createReadStream(filePath);
        readStream.pipe(res);
    };
    return StaticFileController;
}());
exports.StaticFileController = StaticFileController;
