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
    normalization() {
        let dur = this.duration.add(duration_1.duration(0));
        let per = this.period.add(period_1.period(0, 0));
        let movingDays = per.getCertainDays();
        if (movingDays) {
            let moving = period_1.period(0, movingDays);
            per = per.sub(moving);
            dur = dur.add(moving.toDuration());
        }
        return new IntervalImpl(dur, per);
    }
    [Symbol.toPrimitive]() {
        let dur = this.duration;
        let per = this.period;
        let addDays = Math.trunc(dur.days);
        if (addDays !== 0) {
            per = per.add(period_1.period.ofDays(addDays));
            dur = dur.sub(duration_1.duration.ofDays(addDays));
        }
        return `${per}${String(dur).substring(1)}`;
    }
}
function interval(input = "PT0S", ...args) {
    let iso8601 = typeof input === "string" ? util_1.strToTSA(input) : input;
    let dur = duration_1.duration(iso8601, ...args);
    let per = period_1.period(iso8601, ...args);
    return new IntervalImpl(dur, per).normalization();
}
exports.interval = interval;
exports.invl = interval;
tslib_1.__exportStar(require("./duration"), exports);
tslib_1.__exportStar(require("./period"), exports);
//# sourceMappingURL=index.js.map