import { dur } from "../src";

test('1000ms -> 1s', function () {
    expect(dur(1000).s).toBe(1);
});

test("1s -> 1000ms", function () {
    expect(dur('PT1S').ms).toBe(1000);
    expect(dur`PT${1}S`.milliseconds).toBe(1000);
});