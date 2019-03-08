import * as restify from "restify";
import { Next, Request, Response } from "restify";
import { Inject, Injector } from "teys-injector";
import { TokenManager } from "./token-manager";
import { Logger, LogOptions } from "lazy-format-logger";

export enum UserRole {
    None = 0,
    User = 1 << 0,
    SuperUser = 1 << 1,
    Admin = ~(~0 << 4),
}

export interface RestUser {

}

export interface UserProvider {
    userById(id: number | string): RestUser;
}

export interface AuthorizedRequest extends Request {
    identity: RestUser;
}

export abstract class RestController {

    @Inject("api-route")
    private readonly apiPrefix: string;
    @Inject("log-config")
    private readonly logOptions: LogOptions;
    private readonly console: Logger;
    protected server: restify.Server;

    protected constructor(server: restify.Server, protected pathBase: string, protected version: string = 'v1') {
        this.console = new Logger(this.logOptions);
        this.server = server;
        this.setupRoutes();
    }

    public postRequest(path: string, prom: (req: Request, res: Response, next: Next) => Promise<any>) {
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

    public getRequest(path: string, prom: (req: Request, res: Response, next: Next) => Promise<any>) {
        this.console.d(this.constructor.name, `register GET method`, path);
        this.server.get(this.getFullPath(path),
            async (req: Request, res: Response, next: Next) => {
                await this.promiseHandler(prom, req, res, next);
            });
    }

    public patchRequest(path: string, prom: (req: Request, res: Response, next: Next) => Promise<any>) {
        this.console.d(this.constructor.name, `register PATCH method`, path);
        this.server.patch(this.getFullPath(path),
            async (req: Request, res: Response, next: Next) => {
                await this.promiseHandler(prom, req, res, next);
            });
    }

    public deleteRequest(path: string, prom: (req: Request, res: Response, next: Next) => Promise<any>) {
        this.console.d(this.constructor.name, `register DELETE method`, path);
        this.server.del(this.getFullPath(path),
            async (req: Request, res: Response, next: Next) => {
                await this.promiseHandler(prom, req, res, next);
            });
    }

    public setupRoutes(): void {
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
                    'returning 500', exception.message);
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
        return `/${this.apiPrefix}/${this.version}/${this.pathBase}`
    }
}

export function created(rep: Response, data: any) {
    return rep.send(201, data);
}

export function accepted(rep: Response, data: any) {
    return rep.send(202, data);
}

export function ok(rep: Response, data: any) {
    return rep.send(200, data);
}

export function notModified(rep: Response, data: any) {
    return rep.send(304, data);
}

export function notFound(rep: Response, data: any) {
    return rep.send(404, data);
}

export function error(rep: Response, data: any) {
    return rep.send(500, data);
}

export function Delete(path: string = "") {
    return function <T extends RestController>(target: T, propertyKey: string, descriptor: PropertyDescriptor) {
        const original = descriptor.value;
        const setup = target.setupRoutes;
        target.setupRoutes = function () {
            setup.call(this);
            target.deleteRequest.call(this, path, original);
        };
        return descriptor;
    };
}

export function Post(path: string = "") {
    return function <T extends RestController>(target: T, propertyKey: string, descriptor: PropertyDescriptor) {
        const original = descriptor.value;
        const setup = target.setupRoutes;
        target.setupRoutes = function () {
            setup.call(this);
            target.postRequest.call(this, path, original);
        };
        return descriptor;
    };
}

export function Get(path: string = "") {
    return function <T extends RestController>(target: T, propertyKey: string, descriptor: PropertyDescriptor) {
        const original = descriptor.value;
        const setup = target.setupRoutes;
        target.setupRoutes = function () {
            setup.call(this);
            target.getRequest.call(this, path, original);
        };
        return descriptor;
    };
}

export function Patch(path: string = "") {
    return function <T extends RestController>(target: T, propertyKey: string, descriptor: PropertyDescriptor) {
        const original = descriptor.value;
        const setup = target.setupRoutes;
        target.setupRoutes = function () {
            setup.call(this);
            target.patchRequest.call(this, path, original);
        };
        return descriptor;
    };
}

export function Authorize(...roles: UserRole[]) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const original = descriptor.value;
        descriptor.value = function (...args: any[]) {
            return new Promise<any>(async (resolve) => {
                const req = args[0];
                const res = args[1];
                const next = args[2];
                const token = req.header("Authorization");
                if (!token || token.indexOf("Bearer ") === -1) {
                    res.send(401, {error: "unauthorized access"});
                    if (next) {
                        return resolve(next());
                    } else {
                        return resolve();
                    }
                }
                const tokenManager: TokenManager | undefined = Injector.Resolve("_class_tokenmanager");
                const userProvider: UserProvider | undefined = Injector.Resolve("_class_userprovider");
                if (!tokenManager || !userProvider) {
                    res.send(500, {error: "server errors", details: "tokenManager or userProvider missing"});
                    if (next) {
                        return resolve(next());
                    } else {
                        return resolve();
                    }
                }
                try {
                    const jwt = token.substr(7, token.length);
                    const read = await tokenManager.readJwt(jwt);
                    const status = tokenManager.tokenStatus(read, roles);
                    if (!status.valid) {
                        res.send(401, {error: "unauthorized access"});
                        if (next) {
                            return resolve(next());
                        } else {
                            return resolve();
                        }
                    } else {
                        if (status.minuteLeft < 5) {
                            res.header('x-token-renew', status.minuteLeft);
                        }
                        req.identity = await userProvider.userById(read.audience);
                        const prom = original.apply(this, args);
                        if (prom instanceof Promise) {
                            const final = await prom;
                            return resolve(final);
                        }
                        return resolve(prom);
                    }
                } catch (exception) {
                    res.send(500, {error: "server errors", details: exception.message});
                    if (next) {
                        return resolve(next());
                    } else {
                        return resolve();
                    }
                }
            });
        };
        return descriptor;
    };
}
