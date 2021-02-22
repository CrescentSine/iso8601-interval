"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.per = exports.period = void 0;
const duration_1 = require("./duration");
const util_1 = require("./util");
class PeriodImpl {
    constructor(days, months) {
        this._days = days;
        this._months = months;
    }
    add(period) {
        throw new Error('Method not implemented.');
    }
    toDuration(startWith) {
        if (!startWith)
            startWith = new Date;
        let changeDate = new Date(startWith.getTime());
        changeDate.setDate(changeDate.getDate() + this._days);
        changeDate.setMonth(changeDate.getMonth() + this._months);
        return duration_1.duration(changeDate.getTime() - startWith.getTime());
    }
    toDate(start) {
        throw new Error('Method not implemented.');
    }
}
const MONTHS_PER_YEAR = 12;
const DAYS_PER_WEEK = 7;
class PeriodProcessor extends util_1.BaseProcessor {
    constructor() {
        super(...arguments);
        this._totalDays = 0;
        this._totalMonths = 0;
    }
    createResultPeriod() {
        return new PeriodImpl(this._totalDays, this._totalMonths);
    }
    init(input) {
        if (input === 'P') {
            return this.startInputNum;
        }
        throw new SyntaxError('The input must start with P');
    }
    startInputNum(input) {
        if (input === 'T')
            return this.ignoreAfterT;
        return super.startInputNum(input);
    }
    ignoreAfterT() {
        return this.ignoreAfterT;
    }
    checkBeforeProcessInput(_input, isIntegerOrArg) {
        if (!isIntegerOrArg) {
            throw new SyntaxError('Only seconds can be non-integer');
        }
    }
    ;
    processInput(input, value) {
        switch (input) {
            case 'Y':
                this._totalMonths += value * MONTHS_PER_YEAR;
                break;
            case 'M':
                this._totalMonths += value;
                break;
            case 'W':
                this._totalDays += value * DAYS_PER_WEEK;
                break;
            case 'D':
                this._totalDays += value;
                break;
            default: throw new SyntaxError(`Incorrect time unit "${input}" inputted`);
        }
    }
}
function period(input, ...args) {
    let iso8601 = typeof input === "string" ? util_1.strToTSA(input) : input;
    let processor = new PeriodProcessor;
    util_1.TemplateInputProcess(processor, iso8601, args);
    return processor.createResultPeriod();
}
exports.period = period;
exports.per = period;
//# sourceMappingURL=period.js.map