import { dur } from "../src";

test("one seconds", function () {
    expect(dur('PT1S').ms).toBe(1000);
    expect(dur`PT${1}S`.ms).toBe(1000);
});