import { Duration } from './duration';
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
    /** @param allowWeek can convert to format `PnW`, default is `true`. */
    toString(allowWeek?: boolean): string;
}
declare class PeriodImpl implements Period {
    private _days;
    private _months;
    constructor(days: number, months: number);
    getCertainDays(): number;
    getFullMonths(): number;
    add(period: Period): PeriodImpl;
    sub(period: Period): PeriodImpl;
    toDuration(startWith?: Date): Duration;
    toDate(start: Date): Date;
    toDataJson(): {
        years: number;
        months: number;
        days: number;
    };
    private _allowWeek;
    [Symbol.toPrimitive](): string;
    toString(allowWeek?: boolean): string;
}
export declare function period(months: number, days: number): Period;
/** @param iso8601 PnYnMnWnD */
export declare function period(iso8601: string): Period;
/** @param iso8601 PnYnMnWnD */
export declare function period(iso8601: TemplateStringsArray, ...args: number[]): Period;
export declare namespace period {
    function ofYears(years: number): PeriodImpl;
    function ofMonths(months: number): PeriodImpl;
    function ofWeeks(weeks: number): PeriodImpl;
    function ofDays(days: number): PeriodImpl;
}
export { period as per };
//# sourceMappingURL=period.d.ts.map