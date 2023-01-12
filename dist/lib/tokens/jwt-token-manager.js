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
exports.JwtTokenManager = void 0;
var fs = require("fs");
var jwt = require("jsonwebtoken");
var lazy_format_logger_1 = require("lazy-format-logger");
var teys_injector_1 = require("teys-injector");
var helpers_1 = require("../helpers");
var moment = require("moment");
var JwtTokenManager = /** @class */ (function () {
    function JwtTokenManager() {
    }
    Object.defineProperty(JwtTokenManager.prototype, "console", {
        get: function () {
            if (!this._console) {
                this._console = new lazy_format_logger_1.Logger(this.logOptions, this.constructor.name);
            }
            return this._console;
        },
        enumerable: false,
        configurable: true
    });
    JwtTokenManager.prototype.createAuthenticationToken = function (userId, roles) {
        return __awaiter(this, void 0, void 0, function () {
            var token;
            return __generator(this, function (_a) {
                this.console.d("createAuthenticationToken", "for userId: ".concat(userId));
                token = {
                    algorithm: "RS256",
                    audience: userId,
                    expiresIn: this.duration,
                    issuer: this.domain,
                    roles: roles,
                    subject: "credentials",
                    time: new Date().getTime(),
                };
                console.log(this.crypto.privatePath);
                return [2 /*return*/, jwt.sign(token, fs.readFileSync(this.crypto.privatePath), { algorithm: 'RS256' })];
            });
        });
    };
    JwtTokenManager.prototype.readJwt = function (tokenValue) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.console.d("readJwt", tokenValue);
                return [2 /*return*/, new Promise(function (resolve) {
                        jwt.verify(tokenValue, fs.readFileSync(_this.crypto.privatePath), function (err, decoded) {
                            if (err) {
                                _this.console.e(err);
                            }
                            return resolve(decoded);
                        });
                    })];
            });
        });
    };
    JwtTokenManager.prototype.tokenStatus = function (claims, roles) {
        if (roles === void 0) { roles = []; }
        this.console.d("tokenStatus", "for claims", claims);
        try {
            var time = claims.expiresIn.split("");
            var tokenTime = moment(claims.time).add(time[0], time[1]);
            var now = moment();
            var expired = tokenTime.isBefore(now);
            if (expired) {
                this.console.e("Token expired:".concat(claims.time, " token:").concat(claims));
                return { valid: false, minuteLeft: 0 };
            }
            var minuteLeft = tokenTime.diff(now, "minute");
            var valid = claims && claims.issuer === this.domain;
            if (!valid) {
                this.console.e("Token authentic:".concat(valid, " token:").concat(claims));
                return { valid: valid, minuteLeft: minuteLeft };
            }
            if (roles && roles.length > 0) {
                var has1Role = roles.some(function (r) { return (r & claims.roles) === r; });
                return { valid: has1Role && valid, minuteLeft: minuteLeft };
            }
            return { valid: valid, minuteLeft: minuteLeft };
        }
        catch (exception) {
            this.console.e(exception.message);
        }
        return { valid: false, minuteLeft: 0 };
    };
    __decorate([
        (0, teys_injector_1.Inject)(),
        __metadata("design:type", helpers_1.CryptoHelper)
    ], JwtTokenManager.prototype, "crypto", void 0);
    __decorate([
        (0, teys_injector_1.Inject)("token-domain"),
        __metadata("design:type", String)
    ], JwtTokenManager.prototype, "domain", void 0);
    __decorate([
        (0, teys_injector_1.Inject)("token-duration"),
        __metadata("design:type", String)
    ], JwtTokenManager.prototype, "duration", void 0);
    __decorate([
        (0, teys_injector_1.Inject)("log-config"),
        __metadata("design:type", lazy_format_logger_1.LogOptions)
    ], JwtTokenManager.prototype, "logOptions", void 0);
    JwtTokenManager = __decorate([
        (0, teys_injector_1.Injectable)(),
        __metadata("design:paramtypes", [])
    ], JwtTokenManager);
    return JwtTokenManager;
}());
exports.JwtTokenManager = JwtTokenManager;
