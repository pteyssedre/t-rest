import { LogOptions } from "lazy-format-logger";
import { ServerOptions } from "restify";
import { RestController } from "../lib";
import { ApiServer } from "./api-server";
export interface SpaServerOptions extends ServerOptions {
    filePath: string;
    defaultFile?: string;
    domain?: string;
    version?: string;
    authTime?: string;
    proxy?: {
        [key: string]: {
            target: string;
        };
    };
}
export declare class SpaServer extends ApiServer {
    private readonly props;
    constructor(props: SpaServerOptions, logs?: LogOptions);
    beforeStart(): Promise<void>;
    startWithControllers(...controllers: Array<new (server: any) => RestController>): Promise<void>;
    stop(): void;
}
