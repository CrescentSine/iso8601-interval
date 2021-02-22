export function strToTSA(input: string) {
    let res: string[] & { raw?: string[] } = [input];
    res.raw = res;
    return res as TemplateStringsArray;
}

export type TOKEN = string | number;

export interface InputProcessor {
    input(token: TOKEN): void;
}

export function TemplateInputProcess(processor: InputProcessor, input: TemplateStringsArray, args: number[]) {
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

export type STATUS = (this: BaseProcessor, input: TOKEN) => STATUS;

const IS_DIGIT = /[0-9]/;
const ZERO_CODE = '0'.charCodeAt(0);

export abstract class BaseProcessor implements InputProcessor {
    private current: STATUS = this.init;

    private _inputtingNum = 0;
    private _inputtingDecimalUnit = 1;
    private _signOfInputtingNum = 1;
    private _nonIntegerInputted = false;
    private _inputtedUnits = new Set();

    input(token: TOKEN) {
        this.current = this.current(token);
    }

    protected getInputtedValue() {
        return this._inputtingNum * this._signOfInputtingNum;
    }

    // 因为浮点计算可能由精度误差，不要求模板参数为整数
    protected get nonIntegerOnTemplate() {
        return this._nonIntegerInputted;
    }

    protected abstract init(input: TOKEN): STATUS;

    protected startInputNum(input: TOKEN): STATUS {
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

    protected inputtingNum(input: TOKEN): STATUS {
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

    protected inputtingDecimalPart(input: TOKEN): STATUS {
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

    protected checkBeforeProcessInput?(input: TOKEN, isIntegerOrArg: boolean): void;
    protected processInput?(input: TOKEN, value: number): void;

    protected inputtingUnit(input: TOKEN): STATUS {
        if (this._inputtedUnits.has(input)) {
            throw new SyntaxError(`Cannot repeat input the unit "${input}"`);
        }
        if (this.checkBeforeProcessInput) {
            this.checkBeforeProcessInput(input, !this._nonIntegerInputted);
        }
        const inputtedValue = this.getInputtedValue();
        if (this.processInput) {
            this.processInput(input, inputtedValue);
        }
        this._inputtedUnits.add(input);
        return this.startInputNum;
    };
}
