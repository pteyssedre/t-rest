import { Logger } from "lazy-format-logger";
import { UserRole } from "../base";
import { Token } from "../models";
export declare class JwtTokenManager {
    private crypto;
    private readonly domain;
    private readonly duration;
    private readonly logOptions;
    private _console;
    get console(): Logger;
    constructor();
    createAuthenticationToken(userId: number | string, roles?: number): Promise<string>;
    readJwt(tokenValue: string): Promise<Token>;
    tokenStatus(claims: any, roles?: UserRole[]): {
        valid: boolean;
        minuteLeft: number;
    };
}
