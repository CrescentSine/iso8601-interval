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
    input(token: TOKEN): void;
    protected getInputtedValue(): number;
    protected get nonIntegerOnTemplate(): boolean;
    protected abstract init(input: TOKEN): STATUS;
    protected startInputNum(input: TOKEN): STATUS;
    protected inputtingNum(input: TOKEN): STATUS;
    protected inputtingDecimalPart(input: TOKEN): STATUS;
    protected abstract inputtingUnit(input: TOKEN): STATUS;
}
//# sourceMappingURL=util.d.ts.map