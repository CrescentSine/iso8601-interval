import { Duration } from './duration';
import { Period } from './period';
export interface Interval {
    duration: Duration;
    period: Period;
    normalization(): Interval;
}
/** @param iso8601 PnYnMnWnDTnHnMnS */
export declare function interval(iso8601?: string): Interval;
/** @param iso8601 PnYnMnWnDTnHnMnS */
export declare function interval(iso8601: TemplateStringsArray, ...args: number[]): Interval;
export { interval as invl };
export * from './duration';
export * from './period';
//# sourceMappingURL=index.d.ts.map