import {Logger, LogOptions} from "lazy-format-logger";
import * as restify from "restify";
import {Next, Request, Response} from "restify";
import {Inject} from "teys-injector";

export enum UserRole {
    None = 0,
    User = 1 << 0,
    SuperUser = 1 << 1,
    Admin = ~(~0 << 4),
}

export interface RestUser {
    userId?: number | string;
    id?: number | string;
    userUid?: number | string;
    uuid?: string;
    roles?: number;
}

export interface AuthorizedRequest extends Request {
    identity: RestUser;
}

export abstract class RestController {
    protected server: restify.Server;

    @Inject("api-route")
    private readonly apiPrefix: string;
    @Inject("log-config")
    private readonly logOptions: LogOptions;
    private readonly console: Logger;

    protected constructor(server: restify.Server, protected pathBase: string, protected version: string = "v1") {
        this.console = new Logger(this.logOptions);
        this.server = server;
        this.setupRoutes();
    }

    postRequest(path: string, prom: (req: Request, res: Response, next: Next) => Promise<any>) {
        this.console.d(this.constructor.name, `register POST method`, path);
        this.server.post(this.getFullPath(path),
            async (req: Request, res: Response, next: Next) => {
                try {
                    await this.promiseHandler(prom, req, res, next);
                } catch (exception) {
                    console.error(exception);
                    return res.send(500, {error: "internal errors", details: exception.message});
                }
            });
    }

    getRequest(path: string, prom: (req: Request, res: Response, next: Next) => Promise<any>) {
        this.console.d(this.constructor.name, `register GET method`, path);
        this.server.get(this.getFullPath(path),
            async (req: Request, res: Response, next: Next) => {
                await this.promiseHandler(prom, req, res, next);
            });
    }

    patchRequest(path: string, prom: (req: Request, res: Response, next: Next) => Promise<any>) {
        this.console.d(this.constructor.name, `register PATCH method`, path);
        this.server.patch(this.getFullPath(path),
            async (req: Request, res: Response, next: Next) => {
                await this.promiseHandler(prom, req, res, next);
            });
    }

    deleteRequest(path: string, prom: (req: Request, res: Response, next: Next) => Promise<any>) {
        this.console.d(this.constructor.name, `register DELETE method`, path);
        this.server.del(this.getFullPath(path),
            async (req: Request, res: Response, next: Next) => {
                await this.promiseHandler(prom, req, res, next);
            });
    }

    setupRoutes(): void {
        return;
    }

    protected promiseHandler(prom: (req: Request, res: Response, next: Next) => Promise<any>,
                             req: Request, res: Response, next: Next) {
        this.console.d(this.constructor.name, `handling request`, req.method, req.getUrl().path);
        return new Promise<any>(async (resolve) => {
            try {
                await prom.call(this, req, res, next);
                return resolve();
            } catch (exception) {
                this.console.e(this.constructor.name,
                    `could not resolve request`, req.getUrl(),
                    "returning 500", exception.message);
                res.send(500, {error: exception.message});
                next();
                return resolve();
            }
        });
    }

    private getFullPath(path: string) {
        if (path) {
            return `/${this.apiPrefix}/${this.version}/${this.pathBase}/${path}`;
        }
        return `/${this.apiPrefix}/${this.version}/${this.pathBase}`;
    }
}
