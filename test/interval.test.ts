import { invl } from "../src"

test("default input of interval is 0ms", function () {
    let test = invl();
    expect(test.duration.add(test.period.toDuration()).ms).toBe(0);
});

test('1week24h -> 8day', function () {
    let test1 = invl('P1WT24H');
    expect(test1.duration.add(test1.period.toDuration()).d).toBe(8);
    let test2 = invl`P1WT${24}H`;
    expect(test2.duration.add(test2.period.toDuration()).d).toBe(8);
});

test('convert interval to ISO8601 string', function () {
    expect(invl`P13M1WT${24 * 8}H61M3.2S` + "").toBe("P1Y1M2W1DT1H1M3.2S");
});
