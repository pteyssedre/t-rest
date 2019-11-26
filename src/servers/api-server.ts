import {Logger, LogLevel, LogOptions} from "lazy-format-logger";
import * as restify from "restify";
import {ServerOptions} from "restify";
import {Inject, Injectable, Injector} from "teys-injector";
import {CryptoHelper, JwtTokenManager, RestController} from "../lib";

@Injectable()
export class ApiServer {
    protected restify: restify.Server;

    @Inject()
    private readonly cryptoHelper: CryptoHelper;
    @Inject()
    private readonly TokenManager: JwtTokenManager;
    private readonly logOptions: LogOptions;
    private readonly console: Logger;

    constructor(domain: string, apiPath: string, authTime: string, props?: ServerOptions, logs?: LogOptions) {
        this.logOptions = logs ? logs : new LogOptions();
        Injector.Register("log-config", this.logOptions);
        Injector.Register("token-domain", domain);
        Injector.Register("api-route", apiPath);
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

    registerControllers(...controllers: Array<new(server: any) => RestController>): Promise<void> {
        return new Promise<void>((resolve) => {
            for (const ctr of controllers) {
                // let name = ctr.name.toLowerCase();
                // if (name.indexOf("controller") > -1) {
                //     name = name.substring(0, name.indexOf("controller"));
                // }
                this.console.d("registering", ctr.name);
                const never = new ctr(this.restify);
                this.console.d("registration", ctr.name, never !== null);

            }
            return resolve();
        });
    }

    async afterStart(): Promise<void> {
        return new Promise<void>((resolve) => {
            this.console.d("afterStart done");
            this.restify.listen(3000, () => {
                this.console.d("server started");
                return resolve();
            });
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
