"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dur = exports.duration = void 0;
const util_1 = require("./util");
const MS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const MS_PER_MINUTE = SECONDS_PER_MINUTE * MS_PER_SECOND;
const MINUTES_PER_HOUR = 60;
const MS_PER_HOUR = MINUTES_PER_HOUR * MS_PER_MINUTE;
const HOURS_PER_DAY = 24;
const MS_PER_DAY = HOURS_PER_DAY * MS_PER_HOUR;
const DAYS_PER_WEEK = 7;
const MS_PER_WEEK = DAYS_PER_WEEK * MS_PER_DAY;
class DurationImpl {
    constructor(ms) {
        this._ms_num = ms;
    }
    get weeks() {
        return this._ms_num / MS_PER_WEEK;
    }
    get wk() {
        return this.weeks;
    }
    get days() {
        return this._ms_num / MS_PER_DAY;
    }
    get d() {
        return this.days;
    }
    get hours() {
        return this._ms_num / MS_PER_HOUR;
    }
    get h() {
        return this.hours;
    }
    get minutes() {
        return this._ms_num / MS_PER_MINUTE;
    }
    get min() {
        return this.minutes;
    }
    get seconds() {
        return this._ms_num / MS_PER_SECOND;
    }
    get s() {
        return this.seconds;
    }
    get milliseconds() {
        return this._ms_num;
    }
    get ms() {
        return this.milliseconds;
    }
    add(dur) {
        return new DurationImpl(this._ms_num + dur.ms);
    }
    toDate(start) {
        return new Date(this._ms_num + start.getTime());
    }
}
const IS_DIGIT = /[0-9]/;
const ZERO_CODE = '0'.charCodeAt(0);
class DurationProcessor {
    constructor() {
        this._totalMS = 0;
        this._inputtingNum = 0;
        this._inputtingDecimalUnit = 1;
        this._signOfInputtingNum = 1;
        this._nonIntegerInputted = false;
        this._inputtedUnits = new Set();
        this.current = this.init;
    }
    getResultMS() {
        return this._totalMS;
    }
    input(token) {
        this.current = this.current(token);
    }
    init(input) {
        if (input === 'P') {
            return this.waitingT;
        }
        throw new SyntaxError('The input must start with P');
    }
    waitingT(input) {
        if (input !== 'T') {
            return this.waitingT;
        }
        return this.startInputNum;
    }
    startInputNum(input) {
        this._inputtingNum = 0;
        this._nonIntegerInputted = false;
        if (input === '+') {
            this._signOfInputtingNum = +1;
            return this.inputtingNum;
        }
        if (input === '-') {
            this._signOfInputtingNum = -1;
            return this.inputtingNum;
        }
        this._signOfInputtingNum = +1;
        if (typeof input === 'number') {
            this._inputtingNum = input;
            return this.inputtingUnit;
        }
        if (input.match(IS_DIGIT)) {
            return this.inputtingNum(input);
        }
        throw new SyntaxError('Must input a number before the unit sign');
    }
    inputtingNum(input) {
        if (input === '.') {
            this._nonIntegerInputted = true;
            this._inputtingDecimalUnit = 1;
            return this.inputtingDecimalPart;
        }
        if (typeof input === 'number') {
            throw new SyntaxError('Cannot combine templates and parameters as input number');
        }
        if (input.match(IS_DIGIT)) {
            this._inputtingNum *= 10;
            this._inputtingNum += input.charCodeAt(0) - ZERO_CODE;
            return this.inputtingNum;
        }
        return this.inputtingUnit(input);
    }
    inputtingDecimalPart(input) {
        if (typeof input === 'number') {
            throw new SyntaxError('Cannot combine templates and parameters as input number');
        }
        if (input.match(IS_DIGIT)) {
            this._inputtingDecimalUnit /= 10;
            this._inputtingNum += (input.charCodeAt(0) - ZERO_CODE) * this._inputtingDecimalUnit;
            return this.inputtingDecimalPart;
        }
        return this.inputtingUnit(input);
    }
    inputtingUnit(input) {
        if (this._inputtedUnits.has(input)) {
            throw new SyntaxError(`Cannot repeat input the unit "${input}"`);
        }
        const inputtedValue = this._inputtingNum * this._signOfInputtingNum;
        switch (input) {
            case 'H':
                this._totalMS += inputtedValue * MS_PER_HOUR;
                break;
            case 'M':
                this._totalMS += inputtedValue * MS_PER_MINUTE;
                break;
            case 'S':
                this._totalMS += inputtedValue * MS_PER_SECOND;
                break;
            default: throw new SyntaxError(`Incorrect time unit "${input}" inputted`);
        }
        this._inputtedUnits.add(input);
        // 因为浮点计算可能由精度误差，不要求模板参数为整数
        if (input !== 'S' && this._nonIntegerInputted) {
            throw new SyntaxError('Only seconds can be non-integer');
        }
        return this.startInputNum;
    }
}
function duration(input, ...args) {
    if (typeof input == 'number') {
        return new DurationImpl(input);
    }
    let iso8601 = typeof input === "string" ? util_1.strToTSA(input) : input;
    let processor = new DurationProcessor;
    for (let i = 0; i < iso8601.length; ++i) {
        for (let c of iso8601[i]) {
            processor.input(c.toUpperCase());
        }
        if (i < args.length) {
            if (typeof args[i] == 'number') {
                processor.input(args[i]);
            }
            else {
                throw new TypeError("The parameters of the template must be numerics");
            }
        }
    }
    return new DurationImpl(processor.getResultMS());
}
exports.duration = duration;
exports.dur = duration;
(function (duration) {
    function ofWeeks(weeks) {
        return new DurationImpl(weeks * MS_PER_WEEK);
    }
    duration.ofWeeks = ofWeeks;
    function ofDays(days) {
        return new DurationImpl(days * MS_PER_DAY);
    }
    duration.ofDays = ofDays;
    function ofHours(hours) {
        return new DurationImpl(hours * MS_PER_HOUR);
    }
    duration.ofHours = ofHours;
    function ofMinutes(minutes) {
        return new DurationImpl(minutes * MS_PER_MINUTE);
    }
    duration.ofMinutes = ofMinutes;
    function ofSeconds(seconds) {
        return new DurationImpl(seconds * MS_PER_SECOND);
    }
    duration.ofSeconds = ofSeconds;
    function ofMilliseconds(milliseconds) {
        return new DurationImpl(milliseconds);
    }
    duration.ofMilliseconds = ofMilliseconds;
})(duration = exports.duration || (exports.duration = {}));
exports.dur = duration;
//# sourceMappingURL=duration.js.map