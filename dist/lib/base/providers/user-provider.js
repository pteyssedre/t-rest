"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestUserProvider = void 0;
var RestUserProvider = /** @class */ (function () {
    function RestUserProvider() {
    }
    RestUserProvider.prototype.validateCredentials = function (username, password) {
        return new Promise(function (resolve) {
            return resolve(undefined);
        });
    };
    RestUserProvider.prototype.registerUser = function (model) {
        return new Promise(function (resolve) {
            return resolve(undefined);
        });
    };
    return RestUserProvider;
}());
exports.RestUserProvider = RestUserProvider;
