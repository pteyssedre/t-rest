import {LogOptions} from "lazy-format-logger";
import {ServerOptions} from "restify";
import {Injector} from "teys-injector";
import {RestController} from "../lib";
import {ApiServer} from "./api-server";
import {StaticFileController} from "./controllers/static-file-controller";

export interface SpaServerOptions extends ServerOptions {
    filePath: string;
    defaultFile?: string;
    domain?: string;
    version?: string;
    authTime?: string;
    proxy?: { [key: string]: { target: string } };
}

export class SpaServer extends ApiServer {

    private readonly props: SpaServerOptions;

    constructor(props: SpaServerOptions, logs?: LogOptions) {
        if (!props.filePath) {
            throw new Error("must provide filePath for SPA server");
        }
        props.domain = props.domain ? props.domain : "localhost";
        props.version = props.version ? props.version : "v1";
        props.authTime = props.authTime ? props.authTime : "1h";
        super(props.domain, props.version, props.authTime, props, logs);
        this.props = props;
    }

    async beforeStart(): Promise<void> {
        await super.beforeStart();
        Injector.Register("api-route", "api");
    }

    async startWithControllers(...controllers: Array<new(server: any) => RestController>):
        Promise<void> {
        await super.start();
        await super.registerControllers(...controllers);
        const fileController = new StaticFileController(this.restify, this.props);
    }

    stop() {
        super.stop();
    }
}
