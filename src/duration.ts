import { strToTSA } from "./util";

export interface Duration {
    readonly weeks: number;
    readonly wk: number;
    readonly days: number;
    readonly d: number;
    readonly hours: number;
    readonly h: number;
    readonly minutes: number;
    readonly min: number;
    readonly seconds: number;
    readonly s: number;
    readonly milliseconds: number;
    readonly ms: number;
    add(dur: Duration): Duration;
    toDate(start: Date): Date;
}

const MS_PER_SECOND = 1000;

const SECONDS_PER_MINUTE = 60;
const MS_PER_MINUTE = SECONDS_PER_MINUTE * MS_PER_SECOND;

const MINUTES_PER_HOUR = 60;
const MS_PER_HOUR = MINUTES_PER_HOUR * MS_PER_MINUTE;

const HOURS_PER_DAY = 24;
const MS_PER_DAY = HOURS_PER_DAY * MS_PER_HOUR;

const DAYS_PER_WEEK = 7;
const MS_PER_WEEK = DAYS_PER_WEEK * MS_PER_DAY;

class DurationImpl implements Duration {
    private _ms_num: number;
    constructor(ms: number) {
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

    add(dur: Duration) {
        return new DurationImpl(this._ms_num + dur.ms);
    }

    toDate(start: Date) {
        return new Date(this._ms_num + start.getTime());
    }
}

type TOKEN = string | number;
type STATUS = (this: DurationProcessor, input: TOKEN) => STATUS;
const IS_DIGIT = /[0-9]/;
const ZERO_CODE = '0'.charCodeAt(0);

class DurationProcessor {
    private _totalMS = 0;

    getResultMS() {
        return this._totalMS;
    }

    private _inputtingNum = 0;
    private _inputtingDecimalUnit = 1;
    private _signOfInputtingNum = 1;
    private _nonIntegerInputted = false;
    private _inputtedUnits = new Set();

    private current: STATUS = this.init;

    input(token: TOKEN) {
        this.current = this.current(token);
    }

    private init(input: TOKEN): STATUS {
        if (input === 'P') {
            return this.waitingT;
        }
        throw new SyntaxError('The input must start with P');
    }

    private waitingT(input: TOKEN): STATUS {
        if (input !== 'T') {
            return this.waitingT;
        }
        return this.startInputNum;
    }

    private startInputNum(input: TOKEN): STATUS {
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

    private inputtingNum(input: TOKEN): STATUS {
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

    private inputtingDecimalPart(input: TOKEN): STATUS {
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

    private inputtingUnit(input: TOKEN): STATUS {
        if (this._inputtedUnits.has(input)) {
            throw new SyntaxError(`Cannot repeat input the unit "${input}"`);
        }
        const inputtedValue = this._inputtingNum * this._signOfInputtingNum;
        switch (input) {
            case 'H': this._totalMS += inputtedValue * MS_PER_HOUR; break;
            case 'M': this._totalMS += inputtedValue * MS_PER_MINUTE; break;
            case 'S': this._totalMS += inputtedValue * MS_PER_SECOND; break;
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

export function duration(ms: number): Duration;
/** @param iso8601 PTnHnMnS */
export function duration(iso8601: string): Duration;
/** @param iso8601 PTnHnMnS */
export function duration(iso8601: TemplateStringsArray, ...args: number[]): Duration;
export function duration(input: number | string | TemplateStringsArray, ...args: number[]): Duration {
    if (typeof input == 'number') {
        return new DurationImpl(input);
    }

    let iso8601 = typeof input === "string" ? strToTSA(input) : input;
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

export namespace duration {
    export function ofWeeks(weeks: number): Duration {
        return new DurationImpl(weeks * MS_PER_WEEK);
    }

    export function ofDays(days: number): Duration {
        return new DurationImpl(days * MS_PER_DAY);
    }

    export function ofHours(hours: number): Duration {
        return new DurationImpl(hours * MS_PER_HOUR);
    }

    export function ofMinutes(minutes: number): Duration {
        return new DurationImpl(minutes * MS_PER_MINUTE);
    }

    export function ofSeconds(seconds: number): Duration {
        return new DurationImpl(seconds * MS_PER_SECOND);
    }

    export function ofMilliseconds(milliseconds: number): Duration {
        return new DurationImpl(milliseconds);
    }
}

export { duration as dur };
