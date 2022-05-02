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
        this.console = new Logger(this.logOptions, this.constructor.name);
        this.server = server;
        this.setupRoutes();
    }

    postRequest(path: string, prom: (req: Request, res: Response, next: Next) => Promise<any>) {
        const p = this.getFullPath(path);
        this.console.d(`register POST method`, p);
        this.server.post(p,
            async (req: Request, res: Response, next: Next) => {
                try {
                    await this.promiseHandler(prom, req, res, next);
                } catch (exception: any) {
                    this.console.e(exception.code, exception.message);
                    return res.send(500, {error: "internal errors", details: exception.message});
                }
            });
    }

    getRequest(path: string, prom: (req: Request, res: Response, next: Next) => Promise<any>) {
        const p = this.getFullPath(path);
        this.console.d(`register GET method`, p);
        this.server.get(p,
            async (req: Request, res: Response, next: Next) => {
                try {
                    await this.promiseHandler(prom, req, res, next);
                } catch (exception: any) {
                    this.console.e(exception.code, exception.message);
                    return res.send(500, {error: "internal errors", details: exception.message});
                }
            });
    }

    patchRequest(path: string, prom: (req: Request, res: Response, next: Next) => Promise<any>) {
        const p = this.getFullPath(path);
        this.console.d(`register PATCH method`, p);
        this.server.patch(p,
            async (req: Request, res: Response, next: Next) => {
                try {
                    await this.promiseHandler(prom, req, res, next);
                } catch (exception: any) {
                    this.console.e(exception.code, exception.message);
                    return res.send(500, {error: "internal errors", details: exception.message});
                }
            });
    }

    deleteRequest(path: string, prom: (req: Request, res: Response, next: Next) => Promise<any>) {
        const p = this.getFullPath(path);
        this.console.d(`register DELETE method`, p);
        this.server.del(p,
            async (req: Request, res: Response, next: Next) => {
                try {
                    await this.promiseHandler(prom, req, res, next);
                } catch (exception: any) {
                    this.console.e(exception.code, exception.message);
                    return res.send(500, {error: "internal errors", details: exception.message});
                }
            });
    }

    setupRoutes(): void {
        return;
    }

    protected promiseHandler(prom: (req: Request, res: Response, next: Next) => Promise<any>,
                             req: Request, res: Response, next: Next) {
        this.console.d(`handling request`, req.method, req.getUrl().path);
        return new Promise<any>(async (resolve) => {
            try {
                await prom.call(this, req, res, next);
                // @ts-ignore
                return resolve();
            } catch (exception: any) {
                this.console.e(this.constructor.name,
                    `could not resolve request`, req.getUrl(),
                    "returning 500", exception.message);
                res.send(500, {error: exception.message});
                next();
                // @ts-ignore
                return resolve();
            }
        });
    }

    private getFullPath(path: string) {
        if (path) {
            const sanitized = path.indexOf("/") === 0 ? path.substring(1, path.length) : path;
            return `/${this.apiPrefix}/${this.version}/${this.pathBase}/${sanitized}`;
        }
        return `/${this.apiPrefix}/${this.version}/${this.pathBase}`;
    }
}
