import * as fs from "fs";
import * as jwt from "jsonwebtoken";
import {Logger, LogOptions} from "lazy-format-logger";
import {Inject, Injectable} from "teys-injector";
import {UserRole} from "../base";
import {CryptoHelper} from "../helpers";
import {Token} from "../models";
import moment = require("moment");

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
    // tslint:disable-next-line:variable-name
    private _console: Logger;

    get console(): Logger {
        if (!this._console) {
            this._console = new Logger(this.logOptions, this.constructor.name);
        }
        return this._console;
    }

    constructor() {
    }

    async createAuthenticationToken(userId: number | string, roles?: number): Promise<string> {
        this.console.d("createAuthenticationToken", `for userId: ${userId}`);
        const token = {
            algorithm: "RS256",
            audience: userId,
            expiresIn: this.duration,
            issuer: this.domain,
            roles,
            subject: "credentials",
            time: new Date().getTime(),
        };
        return jwt.sign(token, fs.readFileSync(this.crypto.privatePath), { algorithm: 'RS256' });
    }

    async readJwt(tokenValue: string): Promise<Token> {
        this.console.d("readJwt", tokenValue);
        return new Promise<any>((resolve, reject) => {
            jwt.verify(tokenValue, fs.readFileSync(this.crypto.privatePath),(err, decoded) => {
                if (err) {
                    this.console.e(err);
                    return reject(err);
                }
                return resolve(decoded);
            });

        });
    }

    tokenStatus(claims: any, roles: UserRole[] = []): { valid: boolean, minuteLeft: number } {
        this.console.d("tokenStatus", `for claims`, claims);
        try {
            const time = claims.expiresIn.split("");
            const tokenTime = moment(claims.time).add(time[0], time[1]);
            const now = moment();
            const expired = tokenTime.isBefore(now);
            if (expired) {
                this.console.e(`Token expired:${claims.time} token:${claims}`);
                return {valid: false, minuteLeft: 0};
            }
            const minuteLeft = tokenTime.diff(now, "minute");
            const valid = claims && claims.issuer === this.domain;
            if (!valid) {
                this.console.e(`Token authentic:${valid} token:${claims}`);
                return {valid, minuteLeft};
            }
            if (roles && roles.length > 0) {
                const has1Role = roles.some((r: UserRole) => (r & claims.roles) === r);
                return {valid: has1Role && valid, minuteLeft};
            }
            return {valid, minuteLeft};
        } catch (exception: any) {
            this.console.e(exception.message);
        }
        return {valid: false, minuteLeft: 0};
    }
}
