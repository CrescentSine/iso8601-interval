# time-interval

A time duration convert library based on tagged template syntax.

## The ISO8601 duration format

Durations in ISO8601 comes in two formats:

* **`PnYnMnDTnHnMnS`**  - `P<date>T<time>`
  The `n` is replaced by the value for each of the date and time elements that follow the `n`.
* **`PnW`** - the week format.

Check out the details on [Wikipedia](https://en.wikipedia.org/wiki/ISO_8601#Durations)

## Install

```bash
npm install time-interval
```

then `import` to your js module

```javascript
import { duration, dur, period, per, interval, invl } from "time-interval";
```

## Usage

* `duration` or `dur`

    Create a Duration Object to represent the number of milliseconds elapsed.

    It is allowed to process data in the format of `PTnHnMnS`, the input number can be decimals, but the number of milliseconds obtained will be rounded to an integer.

    ```javascript
    dur`PT1S`.ms; // => 1000
    dur`PT${1/3}S`.ms; // => 333
    dur`PT1M`.sub(dur`PT1S`).s; // => 59
    dur`PT24H`.toDate(new Date(2021, 0, 1)); // => Date 2020-01-02
    dur`PT10S`.s == duration.ofSeconds(10).s;
    // Make Timer duration param easier to read
    setTimeout(..., dur`PT1S`.ms);
    ```

* `period` or `per`

    Create a Period Object to represent the duration of Date.

    It is allowed to process data in the format of `PnYnMnWnD` (Although this format does not meet the standard), the input number of years and weeks can be decimals, but the number of days and months obtained will be rounded to an integer.

    ```javascript
    per`P1Y3D`.getCertainDays(); // => 3
    per`P1Y3D`.getFullMonths(); // => 12
    per`P1M`.toDuration(new Date(2021, 0, 1)).h; // => 28 * 24
    per`P1M`.toDate(new Date(2021, 0, 1)); // => Date 2020-03-01
    period.ofWeeks(1).getCertainDays(); // => 7
    ```

* `interval` or `invl`

    Create a Object contains a Duration and a Period.

    It is allowed to process full ISO8601 data in the format of `PnYnMnWnDTnHnMnS`, input parameters will be passed to duration and period for processing separately.

    ```javascript
    invl`P3M2DT60S`.duration.min; // => 1
    invl`P3M2DT60S`.period.getCertainDays(); // => 2
    invl`P3M2DT60S`.period.getFullMonths(); // => 3
    ```
