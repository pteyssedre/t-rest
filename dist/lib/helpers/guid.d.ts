export declare class Guid {
    static get newGuid(): string;
    static get empty(): string;
    private readonly value;
    constructor(data?: string);
    toString(): string;
    get isEmpty(): boolean;
}
