"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.per = exports.period = void 0;
class PeriodImpl {
    add(period) {
        throw new Error('Method not implemented.');
    }
    toDuration(startWith) {
        throw new Error('Method not implemented.');
    }
    toDate(start) {
        throw new Error('Method not implemented.');
    }
}
function period(input, ...args) {
    return new PeriodImpl();
}
exports.period = period;
exports.per = period;
//# sourceMappingURL=period.js.map