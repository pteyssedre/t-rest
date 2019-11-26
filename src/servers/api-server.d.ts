import { LogLevel, LogOptions } from "lazy-format-logger";
import * as restify from "restify";
import { ServerOptions } from "restify";
import { RestController } from "../lib";
export declare class ApiServer {
    protected restify: restify.Server;
    private readonly cryptoHelper;
    private readonly TokenManager;
    private readonly logOptions;
    private readonly console;
    constructor(domain: string, apiPath: string, authTime: string, props?: ServerOptions, logs?: LogOptions);
    beforeStart(): Promise<void>;
    start(): Promise<void>;
    registerControllers(...controllers: Array<new (server: any) => RestController>): Promise<void>;
    afterStart(): Promise<void>;
    changeLogLevel(level: LogLevel): void;
    stop(): void;
}
