"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseProcessor = exports.TemplateInputProcess = exports.strToTSA = void 0;
function strToTSA(input) {
    let res = [input];
    res.raw = res;
    return res;
}
exports.strToTSA = strToTSA;
function TemplateInputProcess(processor, input, args) {
    for (let i = 0; i < input.length; ++i) {
        for (let c of input[i]) {
            processor.input(c.toUpperCase());
        }
        if (i < args.length) {
            if (typeof args[i] == 'number') {
                processor.input(args[i]);
            }
            else {
                throw new TypeError("The parameters of the template must be numerics");
            }
        }
    }
}
exports.TemplateInputProcess = TemplateInputProcess;
const IS_DIGIT = /[0-9]/;
const ZERO_CODE = '0'.charCodeAt(0);
class BaseProcessor {
    constructor() {
        this.current = this.init;
        this._inputtingNum = 0;
        this._inputtingDecimalUnit = 1;
        this._signOfInputtingNum = 1;
        this._nonIntegerInputted = false;
        this._inputtedUnits = new Set();
    }
    input(token) {
        this.current = this.current(token);
    }
    getInputtedValue() {
        return this._inputtingNum * this._signOfInputtingNum;
    }
    startInputNum(input) {
        this._inputtingNum = 0;
        this._nonIntegerInputted = false;
        if (input === '+') {
            this._signOfInputtingNum = +1;
            return this.inputtingNum;
        }
        if (input === '-') {
            this._signOfInputtingNum = -1;
            return this.inputtingNum;
        }
        this._signOfInputtingNum = +1;
        if (typeof input === 'number') {
            this._inputtingNum = input;
            return this.inputtingUnit;
        }
        if (input.match(IS_DIGIT)) {
            return this.inputtingNum(input);
        }
        throw new SyntaxError('Must input a number before the unit sign');
    }
    inputtingNum(input) {
        if (input === '.') {
            this._nonIntegerInputted = true;
            this._inputtingDecimalUnit = 1;
            return this.inputtingDecimalPart;
        }
        if (typeof input === 'number') {
            throw new SyntaxError('Cannot combine templates and parameters as input number');
        }
        if (input.match(IS_DIGIT)) {
            this._inputtingNum *= 10;
            this._inputtingNum += input.charCodeAt(0) - ZERO_CODE;
            return this.inputtingNum;
        }
        return this.inputtingUnit(input);
    }
    inputtingDecimalPart(input) {
        if (typeof input === 'number') {
            throw new SyntaxError('Cannot combine templates and parameters as input number');
        }
        if (input.match(IS_DIGIT)) {
            this._inputtingDecimalUnit /= 10;
            this._inputtingNum += (input.charCodeAt(0) - ZERO_CODE) * this._inputtingDecimalUnit;
            return this.inputtingDecimalPart;
        }
        return this.inputtingUnit(input);
    }
    inputtingUnit(input) {
        if (this._inputtedUnits.has(input)) {
            throw new SyntaxError(`Cannot repeat input the unit "${input}"`);
        }
        if (this.checkBeforeProcessInput) {
            this.checkBeforeProcessInput(input, !this._nonIntegerInputted);
        }
        if (this.processInput) {
            this.processInput(input, this.getInputtedValue());
        }
        this._inputtedUnits.add(input);
        return this.startInputNum;
    }
    ;
}
exports.BaseProcessor = BaseProcessor;
//# sourceMappingURL=util.js.map