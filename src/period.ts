import { Duration, duration } from './duration';

export interface Period {
    add(period: Period): Period;
    toDuration(startWith?: Date): Duration;
    toDate(start: Date): Date;
}

class PeriodImpl implements Period {
    add(period: Period): Period {
        throw new Error('Method not implemented.');
    }
    toDuration(startWith?: Date): Duration {
        throw new Error('Method not implemented.');
    }
    toDate(start: Date): Date {
        throw new Error('Method not implemented.');
    }
}

/** @param iso8601 PnYnMnWnD */
export function period(iso8601: string): Period;
/** @param iso8601 PnYnMnWnD */
export function period(iso8601: TemplateStringsArray, ...args: number[]): Period;
export function period(input: string | TemplateStringsArray, ...args: number[]): Period {
    return new PeriodImpl();
}

export { period as per };
