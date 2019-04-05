import {Logger, LogLevel, LogOptions} from "lazy-format-logger";
import * as restify from "restify";
import {ServerOptions} from "restify";
import {Inject, Injectable, Injector} from "teys-injector";
import {CryptoHelper, JwtTokenManager} from "./lib";

@Injectable()
export class ApiServer {

    @Inject()
    private readonly cryptoHelper: CryptoHelper;
    @Inject()
    private readonly TokenManager: JwtTokenManager;
    private readonly restify: restify.Server;
    private readonly logOptions: LogOptions;
    private readonly console: Logger;

    constructor(domain: string, version: string, authTime: string, props: ServerOptions) {
        this.logOptions = new LogOptions();
        Injector.Register("log-config", this.logOptions);
        Injector.Register("token-domain", domain);
        Injector.Register("api-version", version);
        Injector.Register("token-duration", authTime);
        this.console = new Logger(this.logOptions);
        this.restify = restify.createServer(props);
        this.restify.use(restify.plugins.bodyParser());
        this.restify.use(restify.plugins.queryParser());
    }

    async beforeStart(): Promise<void> {
    }

    async start(): Promise<void> {
        await this.beforeStart();
        try {
            await this.cryptoHelper.initBase();
            // register controller
        } catch (e) {
            // log error
        }
        await this.afterStart();
    }

    async afterStart(): Promise<void> {
    }

    changeLogLevel(level: LogLevel) {
        this.logOptions.level = level;
    }

}
