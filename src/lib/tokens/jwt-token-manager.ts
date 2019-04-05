import * as fs from "fs";
import * as jwt from "jsonwebtoken";
import {Logger, LogOptions} from "lazy-format-logger";
import moment = require("moment");
import {Inject, Injectable} from "teys-injector";
import {UserRole} from "../base/rest-controller";
import {CryptoHelper} from "../helpers/crypto-helper";
import {Token} from "../models";

@Injectable()
export class JwtTokenManager {

    @Inject()
    private crypto: CryptoHelper;
    @Inject("token-domain")
    private readonly domain: string;
    @Inject("token-duration")
    private readonly duration: string;
    @Inject("log-config")
    private readonly logOptions: LogOptions;
    private readonly console: Logger;

    async createAuthenticationToken(userId: number | string, roles?: number): Promise<string> {
        const token = {
            algorithm: "HS256",
            audience: userId,
            expiresIn: this.duration,
            issuer: this.domain,
            roles,
            subject: "credentials",
            time: new Date().getTime(),
        };
        return jwt.sign(token, fs.readFileSync(this.crypto.privatePath));
    }

    async readJwt(tokenValue: string): Promise<Token> {
        return new Promise<any>((resolve) => {
            jwt.verify(tokenValue, fs.readFileSync(this.crypto.privatePath), (err, decoded) => {
                if (err) {
                    this.console.e(this.constructor.name, err);
                }
                return resolve(decoded);
            });

        });
    }

    tokenStatus(claims: any, roles: UserRole[] = []): { valid: boolean, minuteLeft: number } {
        try {
            const time = claims.expiresIn.split("");
            const tokenTime = moment(claims.time).add(time[0], time[1]);
            const now = moment();
            const expired = tokenTime.isBefore(now);
            if (expired) {
                this.console.e(this.constructor.name, `Token expired:${claims.time} token:${claims}`);
                return {valid: false, minuteLeft: 0};
            }
            const minuteLeft = tokenTime.diff(now, "minute");
            const valid = claims && claims.issuer === this.domain;
            if (!valid) {
                this.console.e(this.constructor.name, `Token authentic:${valid} token:${claims}`);
                return {valid, minuteLeft};
            }
            if (roles && roles.length > 0) {
                const has1Role = roles.some((r: UserRole) => (r & claims.roles) === r);
                return {valid: has1Role && valid, minuteLeft};
            }
            return {valid, minuteLeft};
        } catch (exception) {
            this.console.e(this.constructor.name, exception.message);
        }
        return {valid: false, minuteLeft: 0};
    }
}
