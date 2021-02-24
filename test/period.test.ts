import { per } from "../src";
import { register, unregister } from "timezone-mock";

test('1day -> 24h on UTC', function () {
    register('UTC');
    expect(per`P${1}D`.toDuration().h).toBe(24);
    unregister();
});

test('1week + 1day -> 8day', function () {
    expect(per`P1W`.add(per('P1D')).getCertainDays()).toBe(8);
});

test('1week - 1day -> 6day', function () {
    expect(per`P1W`.sub(per`P1D`).getCertainDays()).toBe(6);
});

test('1month from 2021.2.1 is 28 * 24h on UTC', function () {
    register('UTC');
    expect(per`P1M`.toDuration(new Date(2001, 1, 1)).hours).toBe(28 * 24);
    unregister();
});

test('1month after 2020.1.31', function () {
    let aimDate = new Date(2020, 0, 31);
    aimDate.setMonth(1);
    expect(per`P1M`.toDate(new Date(2020, 0, 31)).getTime()).toEqual(aimDate.getTime());
});

test('1year after 2020.1.31', function () {
    let aimDate = new Date(2020, 0, 31);
    aimDate.setFullYear(2021);
    expect(per`P1Y`.toDate(new Date(2020, 0, 31)).getTime()).toEqual(aimDate.getTime());
});

test('period must start with P', function () {
    expect(() => per`1D`).toThrow();
});

test('cannot input non-integer on period template', function () {
    expect(() => per`P1.5D`).toThrow();
});

test('cannot input unknown period time unit', function () {
    expect(() => per`P1T`).toThrow();
});

test('primitive of period is always string', function () {
    expect(+per`P0D`).toBeNaN();
    expect(per(0, 0).toString()).toBe('P0D');
    expect(`${per`P-1Y2M10D`}`).toBe('P-10M10D');
    expect(per`P12M` as unknown as any + 3).toBe('P1Y3');
});

test('create period by static methods', function () {
    expect(per.ofYears(1)).toEqual(per`P1Y`);
    expect(per.ofMonths(1)).toEqual(per`P1M`);
    expect(per.ofWeeks(1)).toEqual(per`P1W`);
    expect(per.ofDays(1)).toEqual(per`P1D`);
});

test('4weeks start from 02-28 in EST is not 28 * 24 hours', function () {
    register('US/Eastern');
    expect(per`P4W`.toDuration(new Date(2020, 1, 28)).h).not.toBe(28 * 24);
    unregister();
});
