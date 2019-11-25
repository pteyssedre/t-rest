import { LogOptions } from "lazy-format-logger";
import { ServerOptions } from "restify";
import { RestController } from "../lib/base";
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
    startWithControllers<T extends RestController>(...controllers: Array<new (server: any) => T>): Promise<void>;
    stop(): void;
}
