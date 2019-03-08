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
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
var teys_injector_1 = require("teys-injector");
var lazy_format_logger_1 = require("lazy-format-logger");
var UserRole;
(function (UserRole) {
    UserRole[UserRole["None"] = 0] = "None";
    UserRole[UserRole["User"] = 1] = "User";
    UserRole[UserRole["SuperUser"] = 2] = "SuperUser";
    UserRole[UserRole["Admin"] = 15] = "Admin";
})(UserRole = exports.UserRole || (exports.UserRole = {}));
var RestController = /** @class */ (function () {
    function RestController(server, pathBase, version) {
        if (version === void 0) { version = 'v1'; }
        this.pathBase = pathBase;
        this.version = version;
        this.console = new lazy_format_logger_1.Logger(this.logOptions);
        this.server = server;
        this.setupRoutes();
    }
    RestController.prototype.postRequest = function (path, prom) {
        var _this = this;
        this.console.d(this.constructor.name, "register POST method", path);
        this.server.post(this.getFullPath(path), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
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
                        console.error(exception_1);
                        return [2 /*return*/, res.send(500, { error: "internal errors", details: exception_1.message })];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    RestController.prototype.getRequest = function (path, prom) {
        var _this = this;
        this.console.d(this.constructor.name, "register GET method", path);
        this.server.get(this.getFullPath(path), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.promiseHandler(prom, req, res, next)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    RestController.prototype.patchRequest = function (path, prom) {
        var _this = this;
        this.console.d(this.constructor.name, "register PATCH method", path);
        this.server.patch(this.getFullPath(path), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.promiseHandler(prom, req, res, next)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    RestController.prototype.deleteRequest = function (path, prom) {
        var _this = this;
        this.console.d(this.constructor.name, "register DELETE method", path);
        this.server.del(this.getFullPath(path), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.promiseHandler(prom, req, res, next)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    RestController.prototype.setupRoutes = function () {
        return;
    };
    RestController.prototype.promiseHandler = function (prom, req, res, next) {
        var _this = this;
        this.console.d(this.constructor.name, "handling request", req.method, req.getUrl().path);
        return new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
            var exception_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, prom.call(this, req, res, next)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, resolve()];
                    case 2:
                        exception_2 = _a.sent();
                        this.console.e(this.constructor.name, "could not resolve request", req.getUrl(), 'returning 500', exception_2.message);
                        res.send(500, { error: exception_2.message });
                        next();
                        return [2 /*return*/, resolve()];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    RestController.prototype.getFullPath = function (path) {
        if (path) {
            return "/" + this.apiPrefix + "/" + this.version + "/" + this.pathBase + "/" + path;
        }
        return "/" + this.apiPrefix + "/" + this.version + "/" + this.pathBase;
    };
    __decorate([
        teys_injector_1.Inject("api-route"),
        __metadata("design:type", String)
    ], RestController.prototype, "apiPrefix", void 0);
    __decorate([
        teys_injector_1.Inject("log-config"),
        __metadata("design:type", lazy_format_logger_1.LogOptions)
    ], RestController.prototype, "logOptions", void 0);
    return RestController;
}());
exports.RestController = RestController;
function created(rep, data) {
    return rep.send(201, data);
}
exports.created = created;
function accepted(rep, data) {
    return rep.send(202, data);
}
exports.accepted = accepted;
function ok(rep, data) {
    return rep.send(200, data);
}
exports.ok = ok;
function notModified(rep, data) {
    return rep.send(304, data);
}
exports.notModified = notModified;
function notFound(rep, data) {
    return rep.send(404, data);
}
exports.notFound = notFound;
function error(rep, data) {
    return rep.send(500, data);
}
exports.error = error;
function Delete(path) {
    if (path === void 0) { path = ""; }
    return function (target, propertyKey, descriptor) {
        var original = descriptor.value;
        var setup = target.setupRoutes;
        target.setupRoutes = function () {
            setup.call(this);
            target.deleteRequest.call(this, path, original);
        };
        return descriptor;
    };
}
exports.Delete = Delete;
function Post(path) {
    if (path === void 0) { path = ""; }
    return function (target, propertyKey, descriptor) {
        var original = descriptor.value;
        var setup = target.setupRoutes;
        target.setupRoutes = function () {
            setup.call(this);
            target.postRequest.call(this, path, original);
        };
        return descriptor;
    };
}
exports.Post = Post;
function Get(path) {
    if (path === void 0) { path = ""; }
    return function (target, propertyKey, descriptor) {
        var original = descriptor.value;
        var setup = target.setupRoutes;
        target.setupRoutes = function () {
            setup.call(this);
            target.getRequest.call(this, path, original);
        };
        return descriptor;
    };
}
exports.Get = Get;
function Patch(path) {
    if (path === void 0) { path = ""; }
    return function (target, propertyKey, descriptor) {
        var original = descriptor.value;
        var setup = target.setupRoutes;
        target.setupRoutes = function () {
            setup.call(this);
            target.patchRequest.call(this, path, original);
        };
        return descriptor;
    };
}
exports.Patch = Patch;
function Authorize() {
    var roles = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        roles[_i] = arguments[_i];
    }
    return function (target, propertyKey, descriptor) {
        var original = descriptor.value;
        descriptor.value = function () {
            var _this = this;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                var req, res, next, token, tokenManager, userProvider, jwt, read, status, _a, prom, final, exception_3;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            req = args[0];
                            res = args[1];
                            next = args[2];
                            token = req.header("Authorization");
                            if (!token || token.indexOf("Bearer ") === -1) {
                                res.send(401, { error: "unauthorized access" });
                                if (next) {
                                    return [2 /*return*/, resolve(next())];
                                }
                                else {
                                    return [2 /*return*/, resolve()];
                                }
                            }
                            tokenManager = teys_injector_1.Injector.Resolve("_class_tokenmanager");
                            userProvider = teys_injector_1.Injector.Resolve("_class_userprovider");
                            if (!tokenManager || !userProvider) {
                                res.send(500, { error: "server errors", details: "tokenManager or userProvider missing" });
                                if (next) {
                                    return [2 /*return*/, resolve(next())];
                                }
                                else {
                                    return [2 /*return*/, resolve()];
                                }
                            }
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 8, , 9]);
                            jwt = token.substr(7, token.length);
                            return [4 /*yield*/, tokenManager.readJwt(jwt)];
                        case 2:
                            read = _b.sent();
                            status = tokenManager.tokenStatus(read, roles);
                            if (!!status.valid) return [3 /*break*/, 3];
                            res.send(401, { error: "unauthorized access" });
                            if (next) {
                                return [2 /*return*/, resolve(next())];
                            }
                            else {
                                return [2 /*return*/, resolve()];
                            }
                            return [3 /*break*/, 7];
                        case 3:
                            if (status.minuteLeft < 5) {
                                res.header('x-token-renew', status.minuteLeft);
                            }
                            _a = req;
                            return [4 /*yield*/, userProvider.userById(read.audience)];
                        case 4:
                            _a.identity = _b.sent();
                            prom = original.apply(this, args);
                            if (!(prom instanceof Promise)) return [3 /*break*/, 6];
                            return [4 /*yield*/, prom];
                        case 5:
                            final = _b.sent();
                            return [2 /*return*/, resolve(final)];
                        case 6: return [2 /*return*/, resolve(prom)];
                        case 7: return [3 /*break*/, 9];
                        case 8:
                            exception_3 = _b.sent();
                            res.send(500, { error: "server errors", details: exception_3.message });
                            if (next) {
                                return [2 /*return*/, resolve(next())];
                            }
                            else {
                                return [2 /*return*/, resolve()];
                            }
                            return [3 /*break*/, 9];
                        case 9: return [2 /*return*/];
                    }
                });
            }); });
        };
        return descriptor;
    };
}
exports.Authorize = Authorize;
