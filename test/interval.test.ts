import { invl } from "../src";
import { register, unregister, TimeZone } from "timezone-mock";

test("default input of interval is 0ms", function () {
    let test = invl();
    expect(test.duration.add(test.period.toDuration()).ms).toBe(0);
});

test('convert interval to ISO8601 string', function () {
    expect(invl`P1MT1H` + "").toBe("P1MT1H");
    expect(invl`P13M1WT24H61M3.2S` + "").toBe(`P1Y1M1WT25H1M3.2S`);
});

test('4weeks start from 2021-02-28 in EST is not 28 * 24 hours', function () {
    function runJudge(zone: TimeZone) {
        register(zone);
        let start = new Date(2021, 1, 28);
        let { period, duration } = invl`P4W`;
        let full = duration.add(period.toDuration(start));
        switch (zone) {
            case 'US/Eastern': expect(full.hours).not.toBe(28 * 24); break;
            case 'UTC': expect(full.hours).toBe(28 * 24); break;
        }
        expect(full.toDate(start)).toEqual(new Date(2021, 2, 28));
        unregister();
    }
    runJudge('US/Eastern');
    runJudge('UTC');
});
