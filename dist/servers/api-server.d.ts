import { LogLevel, LogOptions } from "lazy-format-logger";
import * as restify from "restify";
import { ServerOptions } from "restify";
import { Options } from "restify-cors-middleware2";
import { RestController } from "../lib";
export interface ApiServerOption extends ServerOptions {
    domain?: string;
    port?: number;
    apiRoute?: string;
    authTime?: string;
    extensionsAllowed?: string[];
    defaultFile?: string;
    proxy?: {
        [key: string]: {
            target: string;
        };
    };
    public?: string;
    version?: string;
    cors?: Options;
    bodyParser?: restify.plugins.BodyParserOptions;
}
export declare class ApiServer {
    private static get defaultConfig();
    protected readonly restify: restify.Server;
    protected readonly props: ApiServerOption;
    private readonly cryptoHelper;
    private readonly TokenManager;
    private readonly logOptions;
    private readonly console;
    constructor(props?: ApiServerOption, logs?: LogOptions);
    beforeStart(): Promise<void>;
    start(): Promise<void>;
    registerControllers(...controllers: (new (server: any) => RestController)[]): Promise<void>;
    afterStart(): Promise<void>;
    changeLogLevel(level: LogLevel): void;
    stop(): void;
}
