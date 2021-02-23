export declare function strToTSA(input: string): TemplateStringsArray;
export declare type TOKEN = string | number;
export interface InputProcessor {
    input(token: TOKEN): void;
}
export declare function TemplateInputProcess(processor: InputProcessor, input: TemplateStringsArray, args: number[]): void;
export declare type STATUS = (this: BaseProcessor, input: TOKEN) => STATUS;
export declare abstract class BaseProcessor implements InputProcessor {
    private current;
    private _inputtingNum;
    private _inputtingDecimalUnit;
    private _signOfInputtingNum;
    private _nonIntegerInputted;
    private _inputtedUnits;
    input(token: TOKEN): void;
    protected getInputtedValue(): number;
    protected abstract init(input: TOKEN): STATUS;
    protected startInputNum(input: TOKEN): STATUS;
    protected inputtingNum(input: TOKEN): STATUS;
    protected inputtingDecimalPart(input: TOKEN): STATUS;
    protected checkBeforeProcessInput?(input: TOKEN, isIntegerOrArg: boolean): void;
    protected processInput?(input: TOKEN, value: number): void;
    protected inputtingUnit(input: TOKEN): STATUS;
}
//# sourceMappingURL=util.d.ts.map