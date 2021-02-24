import { Duration, duration } from './duration';
import { Period, period } from './period';
import { strToTSA } from './util';

export interface Interval {
    duration: Duration;
    period: Period;
    normalization(): Interval;
}

class IntervalImpl implements Interval {
    duration: Duration;
    period: Period;
    constructor(duration: Duration, period: Period) {
        this.duration = duration;
        this.period = period;
    }

    normalization(): Interval {
        let dur = this.duration.add(duration(0));
        let per = this.period.add(period(0, 0));
        let movingDays = per.getCertainDays();
    
        if (movingDays) {
            let moving = period(0, movingDays);
            per = per.sub(moving);
            dur = dur.add(moving.toDuration());
        }
        
        return new IntervalImpl(dur, per);
    }
    
    [Symbol.toPrimitive]() {
        let dur = this.duration;
        let per = this.period;

        let addDays = Math.trunc(dur.days);
        if (addDays !== 0) {
            per = per.add(period.ofDays(addDays));
            dur = dur.sub(duration.ofDays(addDays));
        }

        return `${per}${String(dur).substring(1)}`;
    }
}

/** @param iso8601 PnYnMnWnDTnHnMnS */
export function interval(iso8601?: string): Interval;
/** @param iso8601 PnYnMnWnDTnHnMnS */
export function interval(iso8601: TemplateStringsArray, ...args: number[]): Interval;
export function interval(input: string | TemplateStringsArray = "PT0S", ...args: number[]): Interval {
    let iso8601 = typeof input === "string" ? strToTSA(input) : input;
    let dur = duration(iso8601, ...args);
    let per = period(iso8601, ...args);

    return new IntervalImpl(dur, per).normalization();
}

export { interval as invl };

export * from './duration';
export * from './period';
