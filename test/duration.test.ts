import { dur } from "../src";

test('1000ms -> 1s', function () {
    expect(dur(1000).s).toBe(1);
});

test('1s -> 1000ms', function () {
    expect(dur('PT1S').ms).toBe(1000);
    expect(dur`PT${1}S`.milliseconds).toBe(1000);
});

test('1h - 30min = 30min', function () {
    expect(dur`PT1H`.sub(dur`PT30M`).min).toBe(30);
});

test('59s + 1s = 1min', function () {
    expect(dur`PT59S`.add(dur`PT1S`).min).toBe(1);
});

test('1min60s -> 2min', function () {
    expect(dur`PT1M60S`.min).toBe(2);
});

test('1h -> 60min', function () {
    expect(dur.ofHours(1).minutes).toBe(60);
});

test('3min -> 180s', function () {
    expect(dur.ofMinutes(3).seconds).toBe(180);
});

test('30s -> 0.5min', function () {
    expect(dur.ofSeconds(30).minutes).toBe(0.5);
});

test('500ms -> 0.5s', function () {
    expect(dur.ofMilliseconds(500).seconds).toBe(0.5);
});

test('duration must start with P', function () {
    expect(() => dur`T1S`).toThrow();
});

test('only S can be non-integer on template', function () {
    expect(dur`PT0.5S`.ms).toBe(500);
    expect(() => dur`PT0.5H`).toThrow();
});

test('non-integer can only have one float point', function () {
    expect(() => dur`PT1.5.1S`).toThrow();
});

test('can only input number on args', function () {
    expect(() => dur`PT${'D' as unknown as number}S`).toThrow();
});

test('can only use one sign of number on template', function () {
    expect(dur`PT+1S`.s).toBe(1);
    expect(dur`PT-1S`.s).toBe(-1);
    expect(() => dur`PT-+-1S`).toThrow();
});

test('each time unit can be input at most one times', function () {
    expect(() => dur`PT1S1.5S`).toThrow();
});

test('must input a number before the unit sign', function () {
    expect(() => dur`PTS`).toThrow();
});

test('cannot combine templates and parameters as input number', function () {
    expect(() => dur`PT1${1}S`).toThrow();
    expect(() => dur`PT1.${5}S`).toThrow();
});

test('convert duration to number', function () {
    expect(+dur`PT1S`).toBe(1000);
});

test('convert duration to string', function () {
    expect(dur(0).toString()).toBe('PT0S');
    expect(`${dur`PT60S`}`).toBe('PT1M');
    expect(`${dur`PT-3601.5S`}`).toBe('PT-1H-1.5S');
});

test('default convert duration to string', function () {
    expect(dur`PT60S` as unknown as any + 3).toBe('PT1M3');
});
