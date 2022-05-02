"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterModel = void 0;
var RegisterModel = /** @class */ (function () {
    function RegisterModel() {
    }
    RegisterModel.prototype.isValid = function () {
        return !this.username || !this.password;
    };
    return RegisterModel;
}());
exports.RegisterModel = RegisterModel;
