import { Duration, duration } from './duration';
import { BaseProcessor, STATUS, strToTSA, TemplateInputProcess, TOKEN } from './util';

export interface Period {
    add(period: Period): Period;
    toDuration(startWith?: Date): Duration;
    toDate(start: Date): Date;
}

class PeriodImpl implements Period {
    private _days: number;
    private _months: number;
    constructor(days: number, months: number) {
        this._days = days;
        this._months = months;
    }

    add(period: Period): Period {
        throw new Error('Method not implemented.');
    }
    toDuration(startWith?: Date): Duration {
        if (!startWith) startWith = new Date;
        let changeDate = new Date(startWith.getTime());

        if (this._days) changeDate.setDate(changeDate.getDate() + this._days);
        if (this._months) changeDate.setMonth(changeDate.getMonth() + this._months);
        return duration(changeDate.getTime() - startWith.getTime());
    }
    toDate(start: Date): Date {
        throw new Error('Method not implemented.');
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

    protected init(input: TOKEN): STATUS {
        if (input === 'P') {
            return this.startInputNum;
        }
        throw new SyntaxError('The input must start with P');
    }

    protected startInputNum(input: TOKEN): STATUS {
        if (input === 'T') return this.ignoreAfterT;
        return super.startInputNum(input);
    }

    protected ignoreAfterT(): STATUS {
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

/** @param iso8601 PnYnMnWnD */
export function period(iso8601: string): Period;
/** @param iso8601 PnYnMnWnD */
export function period(iso8601: TemplateStringsArray, ...args: number[]): Period;
export function period(input: string | TemplateStringsArray, ...args: number[]): Period {
    let iso8601 = typeof input === "string" ? strToTSA(input) : input;
    let processor = new PeriodProcessor;

    TemplateInputProcess(processor, iso8601, args);

    return processor.createResultPeriod();
}

export { period as per };
