var PREFIX = "tsce";
var i = 0;
var generateId = function () {
    i++;
    return "".concat(i);
};
var CustomEventChannel = /** @class */ (function () {
    function CustomEventChannel(name, opts) {
        var _a;
        /** Total amount of subscribers */
        this.subscriberCount = 0;
        this.id = generateId();
        this.name = name !== null && name !== void 0 ? name : "".concat(PREFIX, "-").concat(this.id);
        this.target = (_a = opts === null || opts === void 0 ? void 0 : opts.target) !== null && _a !== void 0 ? _a : globalThis;
    }
    /** Sends a new event to channel subscribers */
    CustomEventChannel.prototype.send = function (args) {
        if (args === undefined)
            return;
        this.target.dispatchEvent(new CustomEvent(this.name, { detail: args }));
    };
    /** Subscribes to events from channel */
    CustomEventChannel.prototype.subscribe = function (onEvent) {
        var _this = this;
        var listener = function (e) {
            var event = e;
            if (event.detail !== undefined) {
                onEvent(event.detail);
            }
        };
        this.target.addEventListener(this.name, listener);
        this.subscriberCount++;
        return function () {
            _this.target.removeEventListener(_this.name, listener);
            _this.subscriberCount--;
        };
    };
    return CustomEventChannel;
}());
export { CustomEventChannel };
//# sourceMappingURL=index.js.map