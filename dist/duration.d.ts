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
export declare function duration(ms: number): Duration;
/** @param iso8601 PTnHnMnS */
export declare function duration(iso8601: string): Duration;
/** @param iso8601 PTnHnMnS */
export declare function duration(iso8601: TemplateStringsArray, ...args: number[]): Duration;
export declare namespace duration {
    function ofHours(hours: number): Duration;
    function ofMinutes(minutes: number): Duration;
    function ofSeconds(seconds: number): Duration;
    function ofMilliseconds(milliseconds: number): Duration;
}
export { duration as dur };
//# sourceMappingURL=duration.d.ts.map