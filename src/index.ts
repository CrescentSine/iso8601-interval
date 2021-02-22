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
    return { duration: duration(iso8601, ...args), period: period(iso8601, ...args) };
}

export { interval as invl };

export * from './duration';
export * from './period';
