"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Guid = void 0;
var Guid = /** @class */ (function () {
    function Guid(data) {
        if (data) {
            var reg = new RegExp(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
            if (!reg.test(data)) {
                throw new Error("Invalid GUID format: ".concat(data));
            }
            this.value = data;
        }
    }
    Object.defineProperty(Guid, "newGuid", {
        get: function () {
            function s4() {
                return Math.floor((1 + Math.random()) * 65536).toString(16).substring(1);
            }
            return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Guid, "empty", {
        get: function () {
            return "00000000-0000-0000-0000-000000000000";
        },
        enumerable: false,
        configurable: true
    });
    Guid.prototype.toString = function () {
        return this.value;
    };
    Object.defineProperty(Guid.prototype, "isEmpty", {
        get: function () {
            return this.value === Guid.empty;
        },
        enumerable: false,
        configurable: true
    });
    return Guid;
}());
exports.Guid = Guid;
