import { per } from "../src"

test('1day -> 24h', function () {
    expect(per`P${1}D`.toDuration().h).toBe(24);
});