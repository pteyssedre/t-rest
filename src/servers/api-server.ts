import {Logger, LogLevel, LogOptions} from "lazy-format-logger";
import * as restify from "restify";
import {ServerOptions} from "restify";
import * as corsMiddleware from "restify-cors-middleware";
import {Inject, Injectable, Injector} from "teys-injector";
import {CryptoHelper, JwtTokenManager, RestController} from "../lib";

export interface ApiServerOption extends ServerOptions {
    domain?: string;
    port?: number;
    apiRoute?: string;
    authTime?: string;
    defaultFile?: string;
    proxy?: { [key: string]: { target: string } };
    public?: string;
    version?: string;
    cors?: corsMiddleware.Options;
}

@Injectable()
export class ApiServer {

    private static get defaultConfig(): ApiServerOption {
        return {domain: "localhost", port: 3000, apiRoute: "api", authTime: "1h", version: "v1"};
    }

    protected readonly restify: restify.Server;
    protected readonly props: ApiServerOption;

    @Inject()
    private readonly cryptoHelper: CryptoHelper;
    @Inject()
    private readonly TokenManager: JwtTokenManager;
    private readonly logOptions: LogOptions;
    private readonly console: Logger;

    constructor(props?: ApiServerOption, logs?: LogOptions) {
        props = Object.assign(ApiServer.defaultConfig, props || {});
        this.props = props;
        this.logOptions = logs ? logs : new LogOptions();
        Injector.Register("log-config", this.logOptions);
        Injector.Register("token-domain", props.domain || "localhost:" + (props.port || 3000));
        Injector.Register("api-route", props.apiRoute || "api");
        Injector.Register("token-duration", props.authTime || "1h");
        this.console = new Logger(this.logOptions, "ApiServer");
        this.restify = restify.createServer(this.props);
    }

    async beforeStart(): Promise<void> {

        this.restify.use(restify.plugins.bodyParser());
        this.restify.use(restify.plugins.queryParser());

        if (this.props.cors) {
            const {origins, allowHeaders, exposeHeaders} = this.props.cors;
            const CORS = corsMiddleware({allowHeaders, exposeHeaders, origins});
            this.restify.pre(CORS.preflight);
            this.restify.use(CORS.actual);
        }
        this.console.d("beforeStart done");
    }

    async start(): Promise<void> {
        await this.beforeStart();
        try {
            await this.cryptoHelper.initBase();
            return new Promise<void>((resolve) => {
                this.console.d("afterStart done");
                this.restify.listen(this.props.port, () => {
                    return resolve();
                });
            });
        } catch (e) {
            this.console.c("start", new Date(), e.message, e.stack);
        }
        this.console.d("start done");
        await this.afterStart();
    }

    registerControllers(...controllers: Array<new(server: any) => RestController>): Promise<void> {
        return new Promise<void>((resolve) => {
            for (const ctr of controllers) {
                this.console.d("registering", ctr.name);
                const never = new ctr(this.restify);
                this.console.d("registration", ctr.name, never !== null);
            }
            return resolve();
        });
    }

    async afterStart(): Promise<void> {
        this.console.d("server started", `${this.props.domain}:${this.props.port}`);
    }

    changeLogLevel(level: LogLevel) {
        this.logOptions.level = level;
    }

    stop() {
        this.console.w("stopping server was called");
        this.restify.close(() => {
            this.console.d("server stopped");
        });
    }
}
