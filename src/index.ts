import { Duration, duration } from './duration';
import { Period, period } from './period';
import { strToTSA } from './util';

export interface Interval {
    duration: Duration;
    period: Period;
}

class IntervalImpl implements Interval {
    duration: Duration;
    period: Period;
    constructor(duration: Duration, period: Period) {
        this.duration = duration;
        this.period = period;
    }
    
    [Symbol.toPrimitive]() {
        if (this.period.getCertainDays() == 0 && this.period.getFullMonths() == 0) {
            return String(this.duration);
        }
        if (this.duration.ms == 0) {
            return String(this.period);
        }
        return this.period.toString(false) + String(this.duration).substring(1);
    }
}

/** @param iso8601 PnYnMnWnDTnHnMnS */
export function interval(iso8601?: string): Interval;
/** @param iso8601 PnYnMnWnDTnHnMnS */
export function interval(iso8601: TemplateStringsArray, ...args: number[]): Interval;
export function interval(input: string | TemplateStringsArray = "PT0S", ...args: number[]): Interval {
    let iso8601 = typeof input === "string" ? strToTSA(input) : input;

    return new IntervalImpl(duration(iso8601, ...args), period(iso8601, ...args));
}

export { interval as invl };

export * from './duration';
export * from './period';
