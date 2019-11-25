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
var chai = require("chai");
var path = require("path");
var teys_injector_1 = require("teys-injector");
var base_1 = require("../src/lib/base");
var providers_1 = require("../src/lib/base/providers");
var default_account_controller_1 = require("../src/servers/controllers/default-account-controller");
var default_stats_controller_1 = require("../src/servers/controllers/default-stats-controller");
var SpaServer_1 = require("../src/servers/SpaServer");
var axios = require("axios");
var assert = chai.assert;
var RestUserProvider = /** @class */ (function (_super) {
    __extends(RestUserProvider, _super);
    function RestUserProvider() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RestUserProvider.prototype.userById = function (id) {
        return Promise.resolve({ userId: "1234" });
    };
    return RestUserProvider;
}(providers_1.RestUserProvider));
var spa;
describe("Testing pre-register servers", function () {
    before(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    teys_injector_1.Injector.Register("_class_restuserprovider", new RestUserProvider());
                    spa = new SpaServer_1.SpaServer({
                        filePath: path.join(__dirname, "./"),
                        proxy: {
                            "/images": { target: "https://static.lpnt.fr" },
                        },
                    });
                    // @ts-ignore
                    return [4 /*yield*/, spa.startWithControllers(default_account_controller_1.DefaultAccountController, default_stats_controller_1.DefaultStatsController)];
                case 1:
                    // @ts-ignore
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it("Should work", function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios.default.get("http://localhost:3000/api/v1/stats/echo")];
                case 1:
                    response = _a.sent();
                    assert(response.status === 200, "not working");
                    return [2 /*return*/];
            }
        });
    }); });
    it("Should fail authentication", function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios.default.get("http://localhost:3000/api/v1/stats/user", { validateStatus: function () { return true; } })];
                case 1:
                    response = _a.sent();
                    assert(response.status === 401, "not working");
                    return [2 /*return*/];
            }
        });
    }); });
    it("Should success authentication", function () { return __awaiter(void 0, void 0, void 0, function () {
        var tokenM, jwt, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tokenM = teys_injector_1.Injector.Resolve("_class_jwttokenmanager");
                    if (!tokenM) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, tokenM.createAuthenticationToken("1234", base_1.UserRole.Admin)];
                case 1:
                    jwt = _a.sent();
                    return [4 /*yield*/, axios.default.get("http://localhost:3000/api/v1/stats/user", { headers: { authorization: "Bearer " + jwt }, validateStatus: function () { return true; } })];
                case 2:
                    response = _a.sent();
                    assert(response.status === 200);
                    assert(response.data.user.userId === "1234");
                    return [2 /*return*/];
            }
        });
    }); });
    it("Should return default index.html", function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios.default.get("http://localhost:3000/", { validateStatus: function () { return true; } })];
                case 1:
                    response = _a.sent();
                    assert(response.status === 200, "not working");
                    assert(response.headers["content-type"] === "text/html", "not html file");
                    assert(response.data === "<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"UTF-8\">" +
                        "<title>Title</title></head><body></body></html>\r\n", "not index page");
                    return [2 /*return*/];
            }
        });
    }); });
    it("Should return data.json", function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios.default.get("http://localhost:3000/data.json", { validateStatus: function () { return true; } })];
                case 1:
                    response = _a.sent();
                    assert(response.status === 200, "not working");
                    assert(response.headers["content-type"] === "application/json", "not json file");
                    assert(JSON.stringify(response.data) === JSON.stringify({ data: 1 }), "not data file");
                    return [2 /*return*/];
            }
        });
    }); });
    it("Should return 404", function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios.default.get("http://localhost:3000/data2.json", { validateStatus: function () { return true; } })];
                case 1:
                    response = _a.sent();
                    assert(response.status === 404, "not working");
                    return [2 /*return*/];
            }
        });
    }); });
    it("Should return images results", function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios.default.get("http://localhost:3000/images/2019/09/25/19403277lpw-19403339-article-chat-etude-felin-jpg_6528763_660x281.jpg", { validateStatus: function () { return true; } })];
                case 1:
                    response = _a.sent();
                    assert(response.status === 200, "not working");
                    assert(response.headers["content-type"].indexOf("image/jpeg") > -1, "not html");
                    console.log(response.data);
                    return [2 /*return*/];
            }
        });
    }); });
    after(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            spa.stop();
            return [2 /*return*/];
        });
    }); });
});
