import { Duration, duration } from './duration';
import { BaseProcessor, strToTSA, TemplateInputProcess, TOKEN } from './util';

export interface Period {
    add(period: Period): Period;
    sub(period: Period): Period;
    toDuration(startWith?: Date): Duration;
    toDate(start: Date): Date;
    getCertainDays(): number;
    getFullMonths(): number;
    toDataJson(): {
        years: number;
        months: number;
        days: number;
    };
    toString(allowDay?: boolean): string;
}

class PeriodImpl implements Period {
    private _days: number;
    private _months: number;
    constructor(days: number, months: number) {
        this._days = days;
        this._months = months;
    }

    getCertainDays() {
        return this._days;
    }

    getFullMonths() {
        return this._months;
    }

    add(period: Period) {
        return new PeriodImpl(
            this._days + period.getCertainDays(),
            this._months + period.getFullMonths());
    }

    sub(period: Period) {
        return new PeriodImpl(
            this._days - period.getCertainDays(),
            this._months - period.getFullMonths());
    }

    toDuration(startWith?: Date) {
        if (!this._days && !this._months) {
            return duration(0);
        }

        if (!startWith) startWith = new Date;
        let changeDate = new Date(startWith.getTime());

        if (this._days) changeDate.setDate(changeDate.getDate() + this._days);
        if (this._months) changeDate.setMonth(changeDate.getMonth() + this._months);
        return duration(changeDate.getTime() - startWith.getTime());
    }

    toDate(start: Date) {
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

    private _allowDay = true;

    [Symbol.toPrimitive]() {
        if (!this._days && !this._months) {
            return "P0D";
        }

        if (this._allowDay) {
            if (!this._months && !(this._days % DAYS_PER_WEEK)) {
                return `P${this._days / DAYS_PER_WEEK}W`;
            }
        }

        let {
            years, months, days,
        } = this.toDataJson();

        let result = "P";
        if (years) result += `${years}Y`;
        if (months) result += `${months}M`;
        if (days) result += `${days}D`;
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

class PeriodProcessor extends BaseProcessor {
    private _totalDays = 0;
    private _totalMonths = 0;

    createResultPeriod() {
        return new PeriodImpl(this._totalDays, this._totalMonths);
    }

    protected init(input: TOKEN) {
        if (input === 'P') {
            return this.startInputNum;
        }
        throw new SyntaxError('The input must start with P');
    }

    protected startInputNum(input: TOKEN) {
        if (input === 'T') return this.ignoreAfterT;
        return super.startInputNum(input);
    }

    protected ignoreAfterT() {
        return this.ignoreAfterT;
    }

    protected checkBeforeProcessInput(_input: TOKEN, isIntegerOrArg: boolean) {
        if (!isIntegerOrArg) {
            throw new SyntaxError('Only seconds can be non-integer');
        }
    };

    protected processInput(input: TOKEN, value: number) {
        switch (input) {
            case 'Y': this._totalMonths += value * MONTHS_PER_YEAR; break;
            case 'M': this._totalMonths += value; break;
            case 'W': this._totalDays += value * DAYS_PER_WEEK; break;
            case 'D': this._totalDays += value; break;
            default: throw new SyntaxError(`Incorrect time unit "${input}" inputted`);
        }
    }
}

export function period(months: number, days: number): Period;
/** @param iso8601 PnYnMnWnD */
export function period(iso8601: string): Period;
/** @param iso8601 PnYnMnWnD */
export function period(iso8601: TemplateStringsArray, ...args: number[]): Period;
export function period(input: number | string | TemplateStringsArray, ...args: number[]): Period {
    if (typeof input === 'number') {
        return new PeriodImpl(args[0], input);
    }
    let iso8601 = typeof input === "string" ? strToTSA(input) : input;
    let processor = new PeriodProcessor;

    TemplateInputProcess(processor, iso8601, args);

    return processor.createResultPeriod();
}
export namespace period {
    export function ofYears(years: number) {
        return new PeriodImpl(0, years * MONTHS_PER_YEAR);
    }

    export function ofMonths(months: number) {
        return new PeriodImpl(0, months);
    }

    export function ofWeeks(weeks: number) {
        return new PeriodImpl(weeks * DAYS_PER_WEEK, 0);
    }

    export function ofDays(days: number) {
        return new PeriodImpl(days, 0);
    }
}

export { period as per };
