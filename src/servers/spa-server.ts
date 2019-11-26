import {LogOptions} from "lazy-format-logger";
import {RestController} from "../lib";
import {ApiServer, ApiServerOption} from "./api-server";
import {StaticFileController} from "./controllers/static-file-controller";

export class SpaServer extends ApiServer {

    constructor(props: ApiServerOption, logs?: LogOptions) {
        if (!props.public) {
            throw new Error("must provide public path for SPA server");
        }
        super(props, logs);
    }

    async beforeStart(): Promise<void> {
        await super.beforeStart();
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
