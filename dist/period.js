"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.per = exports.period = void 0;
const duration_1 = require("./duration");
const util_1 = require("./util");
class PeriodImpl {
    constructor(days, months) {
        this._allowDay = true;
        this._days = Math.round(days);
        if (Math.abs(this._days - days) > Number.EPSILON) {
            console.warn(`Certain days ${days} have convert to integer value ${this._days}`);
        }
        this._months = Math.round(months);
        if (Math.abs(this._months - months) > Number.EPSILON) {
            console.warn(`Full months ${months} have convert to integer value ${this._months}`);
        }
    }
    getCertainDays() {
        return this._days;
    }
    getFullMonths() {
        return this._months;
    }
    add(period) {
        return new PeriodImpl(this._days + period.getCertainDays(), this._months + period.getFullMonths());
    }
    sub(period) {
        return new PeriodImpl(this._days - period.getCertainDays(), this._months - period.getFullMonths());
    }
    toDuration(startWith) {
        if (!this._days && !this._months) {
            return duration_1.duration(0);
        }
        if (!startWith)
            startWith = new Date;
        let changeDate = new Date(startWith.getTime());
        if (this._days)
            changeDate.setDate(changeDate.getDate() + this._days);
        if (this._months)
            changeDate.setMonth(changeDate.getMonth() + this._months);
        return duration_1.duration(changeDate.getTime() - startWith.getTime());
    }
    toDate(start) {
        let result = new Date(start.getTime());
        result.setDate(result.getDate() + this._days);
        result.setMonth(result.getMonth() + this._months);
        return result;
    }
    toDataJson() {
        let months = this._months % MONTHS_PER_YEAR;
        let years = (this._months - months) / MONTHS_PER_YEAR;
        return { years, months, days: this._days };
    }
    [Symbol.toPrimitive]() {
        if (!this._days && !this._months) {
            return "P0D";
        }
        if (this._allowDay) {
            if (!this._months && !(this._days % DAYS_PER_WEEK)) {
                return `P${this._days / DAYS_PER_WEEK}W`;
            }
        }
        let { years, months, days, } = this.toDataJson();
        let result = "P";
        if (years)
            result += `${years}Y`;
        if (months)
            result += `${months}M`;
        if (days)
            result += `${days}D`;
        return result;
    }
    toString(allowDay = true) {
        this._allowDay = allowDay;
        let result = this[Symbol.toPrimitive]();
        this._allowDay = true;
        return result;
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
    checkBeforeProcessInput(input, isIntegerOrArg) {
        if (isIntegerOrArg || input === 'Y' || input === 'W')
            return;
        throw new SyntaxError('Only years or weeks can be non-integer');
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
    if (typeof input === 'number') {
        return new PeriodImpl(args[0], input);
    }
    let iso8601 = typeof input === "string" ? util_1.strToTSA(input) : input;
    let processor = new PeriodProcessor;
    util_1.TemplateInputProcess(processor, iso8601, args);
    return processor.createResultPeriod();
}
exports.period = period;
exports.per = period;
(function (period) {
    function ofYears(years) {
        return new PeriodImpl(0, years * MONTHS_PER_YEAR);
    }
    period.ofYears = ofYears;
    function ofMonths(months) {
        return new PeriodImpl(0, months);
    }
    period.ofMonths = ofMonths;
    function ofWeeks(weeks) {
        return new PeriodImpl(weeks * DAYS_PER_WEEK, 0);
    }
    period.ofWeeks = ofWeeks;
    function ofDays(days) {
        return new PeriodImpl(days, 0);
    }
    period.ofDays = ofDays;
})(period = exports.period || (exports.period = {}));
exports.per = period;
//# sourceMappingURL=period.js.map