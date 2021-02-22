import { BaseProcessor, STATUS, strToTSA, TemplateInputProcess, TOKEN } from "./util";

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

class DurationProcessor extends BaseProcessor {
    private _totalMS = 0;

    getResultMS() {
        return this._totalMS;
    }

    private _inputtedUnits = new Set();

    protected init(input: TOKEN): STATUS {
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

    protected inputtingUnit(input: TOKEN): STATUS {
        if (this._inputtedUnits.has(input)) {
            throw new SyntaxError(`Cannot repeat input the unit "${input}"`);
        }
        const inputtedValue = this.getInputtedValue();
        switch (input) {
            case 'H': this._totalMS += inputtedValue * MS_PER_HOUR; break;
            case 'M': this._totalMS += inputtedValue * MS_PER_MINUTE; break;
            case 'S': this._totalMS += inputtedValue * MS_PER_SECOND; break;
            default: throw new SyntaxError(`Incorrect time unit "${input}" inputted`);
        }
        this._inputtedUnits.add(input);
        if (input !== 'S' && this.nonIntegerOnTemplate) {
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

    TemplateInputProcess(processor, iso8601, args);

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
