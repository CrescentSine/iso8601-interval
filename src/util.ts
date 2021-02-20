export function strToTSA(input: string) {
    let res: string[] & { raw?: string[] } = [input];
    res.raw = res;
    return res as TemplateStringsArray;
}
