import { LogOptions } from "lazy-format-logger";
import { RestController } from "../lib";
import { ApiServer, ApiServerOption } from "./api-server";
export declare class SpaServer extends ApiServer {
    constructor(props: ApiServerOption, logs?: LogOptions);
    beforeStart(): Promise<void>;
    startWithControllers(...controllers: (new (server: any) => RestController)[]): Promise<void>;
    stop(): void;
}
