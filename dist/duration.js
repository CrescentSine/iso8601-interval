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
    sub(dur) {
        return new DurationImpl(this._ms_num - dur.ms);
    }
    toDate(start) {
        return new Date(this._ms_num + start.getTime());
    }
}
class DurationProcessor extends util_1.BaseProcessor {
    constructor() {
        super(...arguments);
        this._totalMS = 0;
    }
    getResultMS() {
        return this._totalMS;
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
    checkBeforeProcessInput(input, isIntegerOrArg) {
        if (input !== 'S' && !isIntegerOrArg) {
            throw new SyntaxError('Only seconds can be non-integer');
        }
    }
    ;
    processInput(input, value) {
        switch (input) {
            case 'H':
                this._totalMS += value * MS_PER_HOUR;
                break;
            case 'M':
                this._totalMS += value * MS_PER_MINUTE;
                break;
            case 'S':
                this._totalMS += value * MS_PER_SECOND;
                break;
            default: throw new SyntaxError(`Incorrect time unit "${input}" inputted`);
        }
    }
}
function duration(input, ...args) {
    if (typeof input == 'number') {
        return new DurationImpl(input);
    }
    let iso8601 = typeof input === "string" ? util_1.strToTSA(input) : input;
    let processor = new DurationProcessor;
    util_1.TemplateInputProcess(processor, iso8601, args);
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