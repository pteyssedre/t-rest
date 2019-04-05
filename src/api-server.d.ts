import { LogLevel } from "lazy-format-logger";
import { ServerOptions } from "restify";
export declare class ApiServer {
    private readonly cryptoHelper;
    private readonly TokenManager;
    private readonly restify;
    private readonly logOptions;
    private readonly console;
    constructor(domain: string, version: string, authTime: string, props: ServerOptions);
    beforeStart(): Promise<void>;
    start(): Promise<void>;
    afterStart(): Promise<void>;
    changeLogLevel(level: LogLevel): void;
}
