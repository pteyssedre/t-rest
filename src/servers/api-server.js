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
var lazy_format_logger_1 = require("lazy-format-logger");
var restify = require("restify");
var teys_injector_1 = require("teys-injector");
var index_1 = require("../lib/index");
var ApiServer = /** @class */ (function () {
    function ApiServer(domain, version, authTime, props, logs) {
        this.logOptions = logs ? logs : new lazy_format_logger_1.LogOptions();
        teys_injector_1.Injector.Register("log-config", this.logOptions);
        teys_injector_1.Injector.Register("token-domain", domain);
        teys_injector_1.Injector.Register("api-version", version);
        teys_injector_1.Injector.Register("token-duration", authTime);
        this.console = new lazy_format_logger_1.Logger(this.logOptions, "ApiServer");
        this.restify = restify.createServer(props);
        this.restify.use(restify.plugins.bodyParser());
        this.restify.use(restify.plugins.queryParser());
    }
    ApiServer.prototype.beforeStart = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // todo add mandatory stuff CORS etc...
                // todo logging action
                this.console.d("beforeStart done");
                return [2 /*return*/];
            });
        });
    };
    ApiServer.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.beforeStart()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.cryptoHelper.initBase()];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        return [3 /*break*/, 5];
                    case 5:
                        this.console.d("start done");
                        return [4 /*yield*/, this.afterStart()];
                    case 6:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ApiServer.prototype.registerControllers = function () {
        var controllers = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            controllers[_i] = arguments[_i];
        }
        for (var _a = 0, controllers_1 = controllers; _a < controllers_1.length; _a++) {
            var ctr = controllers_1[_a];
            var name = ctr.name.toLowerCase();
            if (name.indexOf("controller") > -1) {
                name = name.substring(0, name.indexOf("controller"));
            }
            var never = new ctr(this.restify);
        }
    };
    ApiServer.prototype.afterStart = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                // todo logging action
                this.console.d("afterStart done");
                this.restify.listen(3000, function () {
                    _this.console.d("server started");
                });
                return [2 /*return*/];
            });
        });
    };
    ApiServer.prototype.changeLogLevel = function (level) {
        this.logOptions.level = level;
    };
    ApiServer.prototype.stop = function () {
        var _this = this;
        this.restify.close(function () {
            _this.console.d("server stopped");
        });
    };
    __decorate([
        teys_injector_1.Inject(),
        __metadata("design:type", index_1.CryptoHelper)
    ], ApiServer.prototype, "cryptoHelper", void 0);
    __decorate([
        teys_injector_1.Inject(),
        __metadata("design:type", index_1.JwtTokenManager)
    ], ApiServer.prototype, "TokenManager", void 0);
    ApiServer = __decorate([
        teys_injector_1.Injectable(),
        __metadata("design:paramtypes", [String, String, String, Object, lazy_format_logger_1.LogOptions])
    ], ApiServer);
    return ApiServer;
}());
exports.ApiServer = ApiServer;
