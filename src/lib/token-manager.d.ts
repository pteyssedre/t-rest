import { UserRole } from "./rest-controller";
export declare class TokenManager {
    private crypto;
    private domain;
    private duration;
    createAuthenticationToken(userId: number | string, roles?: number): Promise<any>;
    readJwt(tokenValue: string): Promise<any>;
    tokenStatus(claims: any, roles?: UserRole[]): {
        valid: boolean;
        minuteLeft: number;
    };
}
