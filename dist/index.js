"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invl = exports.interval = void 0;
const tslib_1 = require("tslib");
const duration_1 = require("./duration");
const period_1 = require("./period");
const util_1 = require("./util");
function interval(input = "PT0S", ...args) {
    let iso8601 = typeof input === "string" ? util_1.strToTSA(input) : input;
    return { duration: duration_1.duration(iso8601, ...args), period: period_1.period(iso8601, ...args) };
}
exports.interval = interval;
exports.invl = interval;
tslib_1.__exportStar(require("./duration"), exports);
tslib_1.__exportStar(require("./period"), exports);
//# sourceMappingURL=index.js.map