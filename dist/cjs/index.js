"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomEventChannel = void 0;
var PREFIX = "tsce";
var i = 0;
var generateId = function () {
    i++;
    return "".concat(i);
};
var CustomEventChannel = /** @class */ (function () {
    function CustomEventChannel(name) {
        var _this = this;
        /** Total amount of subscribers */
        this.subscriberCount = 0;
        this.id = generateId();
        this.name = name !== null && name !== void 0 ? name : "".concat(PREFIX, "-").concat(this.id);
        this.send = function (args) {
            if (args === undefined)
                return;
            document.dispatchEvent(new CustomEvent(_this.name, { detail: args }));
        };
        this.subscribe = function (onEvent) {
            var listener = function (e) {
                var event = e;
                if (event.detail !== undefined) {
                    onEvent(event.detail);
                }
            };
            document.addEventListener(_this.name, listener);
            _this.subscriberCount++;
            return function () {
                document.removeEventListener(_this.name, listener);
                _this.subscriberCount--;
            };
        };
    }
    return CustomEventChannel;
}());
exports.CustomEventChannel = CustomEventChannel;
//# sourceMappingURL=index.js.map