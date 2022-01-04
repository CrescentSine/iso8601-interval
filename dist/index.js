"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invl = exports.interval = void 0;
const tslib_1 = require("tslib");
const duration_1 = require("./duration");
const period_1 = require("./period");
const util_1 = require("./util");
class IntervalImpl {
    constructor(duration, period) {
        this.duration = duration;
        this.period = period;
    }
    [Symbol.toPrimitive]() {
        if (this.period.getCertainDays() == 0 && this.period.getFullMonths() == 0) {
            return String(this.duration);
        }
        if (this.duration.ms == 0) {
            return String(this.period);
        }
        return this.period.toString(false) + String(this.duration).substring(1);
    }
}
function interval(input = "PT0S", ...args) {
    let iso8601 = typeof input === "string" ? (0, util_1.strToTSA)(input) : input;
    return new IntervalImpl((0, duration_1.duration)(iso8601, ...args), (0, period_1.period)(iso8601, ...args));
}
exports.interval = interval;
exports.invl = interval;
(0, tslib_1.__exportStar)(require("./duration"), exports);
(0, tslib_1.__exportStar)(require("./period"), exports);
//# sourceMappingURL=index.js.map