import { Duration } from './duration';
export interface Period {
    add(period: Period): Period;
    toDuration(startWith?: Date): Duration;
    toDate(start: Date): Date;
}
/** @param iso8601 PnYnMnWnD */
export declare function period(iso8601: string): Period;
/** @param iso8601 PnYnMnWnD */
export declare function period(iso8601: TemplateStringsArray, ...args: number[]): Period;
export { period as per };
//# sourceMappingURL=period.d.ts.map