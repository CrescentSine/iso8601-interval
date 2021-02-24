import { BaseProcessor, strToTSA, TemplateInputProcess, TOKEN } from "./util";

export interface Duration {
    readonly hours: number;
    readonly h: number;
    readonly minutes: number;
    readonly min: number;
    readonly seconds: number;
    readonly s: number;
    readonly milliseconds: number;
    readonly ms: number;
    add(dur: Duration): Duration;
    sub(dur: Duration): Duration;
    toDate(start: Date): Date;
    toDataJson(): {
        hours: number;
        minutes: number;
        seconds: number;
    };
}

const MS_PER_SECOND = 1000;

const SECONDS_PER_MINUTE = 60;
const MS_PER_MINUTE = SECONDS_PER_MINUTE * MS_PER_SECOND;

const MINUTES_PER_HOUR = 60;
const MS_PER_HOUR = MINUTES_PER_HOUR * MS_PER_MINUTE;

type TypeHint = "default" | "string" | "number";

class DurationImpl implements Duration {
    private _ms_num: number;
    constructor(ms: number) {
        this._ms_num = ms;
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

    sub(dur: Duration) {
        return new DurationImpl(this._ms_num - dur.ms);
    }

    toDate(start: Date) {
        return new Date(this._ms_num + start.getTime());
    }

    toDataJson() {
        let left = this._ms_num;
        let seconds = left % MS_PER_MINUTE;
        left -= seconds;
        seconds /= MS_PER_SECOND;
        left /= MS_PER_MINUTE;
        let minutes = left % MINUTES_PER_HOUR;
        left -= minutes;
        let hours = left / MINUTES_PER_HOUR;
        return { hours, minutes, seconds };
    }

    [Symbol.toPrimitive](hint: TypeHint) {
        if (hint === "number") {
            return this._ms_num;
        }
        if (!this._ms_num) {
            return "PT0S";
        }

        let {
            hours, minutes, seconds,
        } = this.toDataJson();

        let result = "PT";
        if (hours) result += `${hours}H`;
        if (minutes) result += `${minutes}M`;
        if (seconds) result += `${seconds}S`;
        return result;
    }

    toString() {
        return this[Symbol.toPrimitive]("string");
    }
}

class DurationProcessor extends BaseProcessor {
    private _totalMS = 0;

    getResultMS() {
        return this._totalMS;
    }

    protected init(input: TOKEN) {
        if (input === 'P') {
            return this.waitingT;
        }
        throw new SyntaxError('The input must start with P');
    }

    private waitingT(input: TOKEN) {
        if (input !== 'T') {
            return this.waitingT;
        }
        return this.startInputNum;
    }

    protected checkBeforeProcessInput(input: TOKEN, isIntegerOrArg: boolean) {
        if (input !== 'S' && !isIntegerOrArg) {
            throw new SyntaxError('Only seconds can be non-integer');
        }
    };

    protected processInput(input: TOKEN, value: number) {
        switch (input) {
            case 'H': this._totalMS += value * MS_PER_HOUR; break;
            case 'M': this._totalMS += value * MS_PER_MINUTE; break;
            case 'S': this._totalMS += value * MS_PER_SECOND; break;
            default: throw new SyntaxError(`Incorrect time unit "${input}" inputted`);
        }
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
