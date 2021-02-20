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
export declare function duration(ms: number): Duration;
/** @param iso8601 PTnHnMnS */
export declare function duration(iso8601: string): Duration;
/** @param iso8601 PTnHnMnS */
export declare function duration(iso8601: TemplateStringsArray, ...args: number[]): Duration;
export declare namespace duration {
    function ofWeeks(weeks: number): Duration;
    function ofDays(days: number): Duration;
    function ofHours(hours: number): Duration;
    function ofMinutes(minutes: number): Duration;
    function ofSeconds(seconds: number): Duration;
    function ofMilliseconds(milliseconds: number): Duration;
}
export { duration as dur };
//# sourceMappingURL=duration.d.ts.map