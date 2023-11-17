"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestController = exports.UserRole = void 0;
var lazy_format_logger_1 = require("lazy-format-logger");
var teys_injector_1 = require("teys-injector");
var UserRole;
(function (UserRole) {
    UserRole[UserRole["None"] = 0] = "None";
    UserRole[UserRole["User"] = 1] = "User";
    UserRole[UserRole["SuperUser"] = 2] = "SuperUser";
    UserRole[UserRole["Admin"] = 15] = "Admin";
})(UserRole = exports.UserRole || (exports.UserRole = {}));
var RestController = /** @class */ (function () {
    function RestController(server, pathBase, version) {
        if (version === void 0) { version = "v1"; }
        this.pathBase = pathBase;
        this.version = version;
        this.console = new lazy_format_logger_1.Logger(this.logOptions, this.constructor.name);
        this.server = server;
        this.setupRoutes();
    }
    RestController.prototype.postRequest = function (path, prom) {
        var _this = this;
        var p = this.getFullPath(path);
        this.console.d("register POST method", p);
        this.server.post(p, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var exception_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.promiseHandler(prom, req, res, next)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        exception_1 = _a.sent();
                        this.console.e(exception_1.code, exception_1.message);
                        return [2 /*return*/, res.send(500, { error: "internal errors", details: exception_1.message })];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    RestController.prototype.getRequest = function (path, prom) {
        var _this = this;
        var p = this.getFullPath(path);
        this.console.d("register GET method", p);
        this.server.get(p, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var exception_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.promiseHandler(prom, req, res, next)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        exception_2 = _a.sent();
                        this.console.e(exception_2.code, exception_2.message);
                        return [2 /*return*/, res.send(500, { error: "internal errors", details: exception_2.message })];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    RestController.prototype.patchRequest = function (path, prom) {
        var _this = this;
        var p = this.getFullPath(path);
        this.console.d("register PATCH method", p);
        this.server.patch(p, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var exception_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.promiseHandler(prom, req, res, next)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        exception_3 = _a.sent();
                        this.console.e(exception_3.code, exception_3.message);
                        return [2 /*return*/, res.send(500, { error: "internal errors", details: exception_3.message })];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    RestController.prototype.deleteRequest = function (path, prom) {
        var _this = this;
        var p = this.getFullPath(path);
        this.console.d("register DELETE method", p);
        this.server.del(p, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var exception_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.promiseHandler(prom, req, res, next)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        exception_4 = _a.sent();
                        this.console.e(exception_4.code, exception_4.message);
                        return [2 /*return*/, res.send(500, { error: "internal errors", details: exception_4.message })];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    RestController.prototype.setupRoutes = function () {
        return;
    };
    RestController.prototype.promiseHandler = function (prom, req, res, next) {
        var _this = this;
        this.console.d("handling request", req.method, req.getUrl().path);
        return new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
            var results, exception_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, prom.call(this, req, res, next)];
                    case 1:
                        results = _a.sent();
                        return [2 /*return*/, resolve(results)];
                    case 2:
                        exception_5 = _a.sent();
                        this.console.e(this.constructor.name, "could not resolve request", req.getUrl(), "returning 500", exception_5.message);
                        res.send(500, { error: exception_5.message });
                        return [2 /*return*/, resolve(next())];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    RestController.prototype.getFullPath = function (path) {
        if (path) {
            var sanitized = path.indexOf("/") === 0 ? path.substring(1, path.length) : path;
            return "/".concat(this.apiPrefix, "/").concat(this.version, "/").concat(this.pathBase, "/").concat(sanitized);
        }
        return "/".concat(this.apiPrefix, "/").concat(this.version, "/").concat(this.pathBase);
    };
    __decorate([
        (0, teys_injector_1.Inject)("api-route"),
        __metadata("design:type", String)
    ], RestController.prototype, "apiPrefix", void 0);
    __decorate([
        (0, teys_injector_1.Inject)("log-config"),
        __metadata("design:type", lazy_format_logger_1.LogOptions)
    ], RestController.prototype, "logOptions", void 0);
    return RestController;
}());
exports.RestController = RestController;
