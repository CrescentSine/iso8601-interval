"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invl = exports.interval = void 0;
const tslib_1 = require("tslib");
const duration_1 = require("./duration");
const period_1 = require("./period");
const util_1 = require("./util");
function interval(input = "PT0S", ...args) {
    let iso8601 = typeof input === "string" ? util_1.strToTSA(input) : input;
    let dur = duration_1.duration(iso8601, ...args);
    let per = period_1.period(iso8601, ...args);
    let movingDays = per.getCertainDays();
    if (movingDays) {
        let moving = period_1.period(0, movingDays);
        per = per.sub(moving);
        dur = dur.add(moving.toDuration());
    }
    return { duration: dur, period: per };
}
exports.interval = interval;
exports.invl = interval;
tslib_1.__exportStar(require("./duration"), exports);
tslib_1.__exportStar(require("./period"), exports);
//# sourceMappingURL=index.js.map