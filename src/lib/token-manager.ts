import * as fs from "fs";
import * as jwt from "jsonwebtoken";

import { CryptoHelper } from "./crypto-helper";
import { Inject, Injectable } from "teys-injector";
import { UserRole } from "./rest-controller";
import moment = require("moment");

@Injectable()
export class TokenManager {

    @Inject()
    private crypto: CryptoHelper;
    @Inject("token-domain")
    private domain: string;
    @Inject("token-duration")
    private duration: string;

    public async createAuthenticationToken(userId: number | string, roles?: number): Promise<any> {
        const token = {
            algorithm: "HS256",
            audience: userId,
            roles: roles,
            expiresIn: this.duration,
            time: new Date().getTime(),
            issuer: this.domain,
            subject: "credentials",

        };
        return jwt.sign(token, fs.readFileSync(this.crypto.privatePath));
    }

    public async readJwt(tokenValue: string): Promise<any> {
        return new Promise<any>(resolve => {
            jwt.verify(tokenValue, fs.readFileSync(this.crypto.privatePath), (err, decoded) => {
                if (err) {
                    console.error(err);
                }
                return resolve(decoded);
            });

        });
    }

    public tokenStatus(claims: any, roles: UserRole[] = []): { valid: boolean, minuteLeft: number } {
        try {
            const time = claims.expiresIn.split("");
            const tokenTime = moment(claims.time).add(time[0], time[1]);
            const now = moment();
            const expired = tokenTime.isBefore(now);
            if (expired) {
                console.error(`Token expired:${claims.time} token:${claims}`);
                return {valid: false, minuteLeft: 0};
            }
            const minuteLeft = tokenTime.diff(now, "minute");
            const valid = claims && claims.issuer === this.domain;
            if (!valid) {
                console.error(`Token authentic:${valid} token:${claims}`);
                return {valid, minuteLeft};
            }
            if (roles && roles.length > 0) {
                const has1Role = roles.some((r: UserRole) => (r & claims.roles) === r);
                return {valid: has1Role && valid, minuteLeft};
            }
            return {valid, minuteLeft};
        } catch (exception) {
            console.error(exception.message);
        }
        return {valid: false, minuteLeft: 0};
    }
}
