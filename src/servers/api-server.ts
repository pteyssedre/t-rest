import {Logger, LogLevel, LogOptions} from "lazy-format-logger";
import * as restify from "restify";
import {ServerOptions} from "restify";
import {Inject, Injectable, Injector} from "teys-injector";
import {CryptoHelper, JwtTokenManager, RestController} from "../lib/index";

@Injectable()
export class ApiServer {
    protected restify: restify.Server;

    @Inject()
    private readonly cryptoHelper: CryptoHelper;
    @Inject()
    private readonly TokenManager: JwtTokenManager;
    private readonly logOptions: LogOptions;
    private readonly console: Logger;

    constructor(domain: string, version: string, authTime: string, props?: ServerOptions, logs?: LogOptions) {
        this.logOptions = logs ? logs : new LogOptions();
        Injector.Register("log-config", this.logOptions);
        Injector.Register("token-domain", domain);
        Injector.Register("api-version", version);
        Injector.Register("token-duration", authTime);
        this.console = new Logger(this.logOptions, "ApiServer");
        this.restify = restify.createServer(props);
        this.restify.use(restify.plugins.bodyParser());
        this.restify.use(restify.plugins.queryParser());
    }

    async beforeStart(): Promise<void> {
        // todo add mandatory stuff CORS etc...
        // todo logging action
        this.console.d("beforeStart done");
    }

    async start(): Promise<void> {
        await this.beforeStart();
        try {
            await this.cryptoHelper.initBase();
            // register controller
        } catch (e) {
            // log error
        }
        this.console.d("start done");
        await this.afterStart();
    }

    registerControllers<T extends RestController>(...controllers: Array<new(server: any) => T>) {
        for (const ctr of controllers) {
            let name = ctr.name.toLowerCase();
            if (name.indexOf("controller") > -1) {
                name = name.substring(0, name.indexOf("controller"));
            }
            const never = new ctr(this.restify);
        }
    }

    async afterStart(): Promise<void> {
        // todo logging action
        this.console.d("afterStart done");
        this.restify.listen(3000, () => {
            this.console.d("server started");
        });
    }

    changeLogLevel(level: LogLevel) {
        this.logOptions.level = level;
    }

    stop() {
        this.restify.close(() => {
            this.console.d("server stopped");
        });
    }
}
