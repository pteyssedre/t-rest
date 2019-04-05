"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RegisterModel = /** @class */ (function () {
    function RegisterModel() {
    }
    RegisterModel.prototype.isValid = function () {
        return !this.username || !this.password;
    };
    return RegisterModel;
}());
exports.RegisterModel = RegisterModel;
