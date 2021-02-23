import { Duration, duration } from './duration';
import { Period, period } from './period';
import { strToTSA } from './util';

export interface Interval {
    duration: Duration;
    period: Period;
}

/** @param iso8601 PnYnMnWnDTnHnMnS */
export function interval(iso8601?: string): Interval;
/** @param iso8601 PnYnMnWnDTnHnMnS */
export function interval(iso8601: TemplateStringsArray, ...args: number[]): Interval;
export function interval(input: string | TemplateStringsArray = "PT0S", ...args: number[]): Interval {
    let iso8601 = typeof input === "string" ? strToTSA(input) : input;
    let dur = duration(iso8601, ...args);
    let per = period(iso8601, ...args);
    let movingDays = per.getCertainDays();

    if (movingDays) {
        let moving = period(0, movingDays);
        per = per.sub(moving);
        dur = dur.add(moving.toDuration());
    }

    return { duration: dur, period: per };
}

export { interval as invl };

export * from './duration';
export * from './period';
