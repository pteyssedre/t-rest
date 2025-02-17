import {Injector} from "teys-injector";
import {JwtTokenManager} from "../tokens";
import {RestUserProvider} from "./providers";
import {RestController, UserRole} from "./rest-controller";
import {error} from "./responses";

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
                        // @ts-ignore
                        return resolve();
                    }
                }
                // @ts-ignore
                if (this.console) {
                    // @ts-ignore
                    this.console.d(target.constructor.name, "trying to see if it works");
                }
                const tokenManager: JwtTokenManager | undefined = Injector.Resolve("_class_jwttokenmanager");
                const userProvider: RestUserProvider | undefined = Injector.Resolve("_class_restuserprovider");
                if (!tokenManager || !userProvider) {
                    res.send(500, {error: "server errors", details: "JwtTokenManager or RestUserProvider are missing"});
                    if (next) {
                        return resolve(next());
                    } else {
                        // @ts-ignore
                        return resolve();
                    }
                }
                try {
                    const jwt = token.substr(7, token.length);
                    const read = await tokenManager.readJwt(jwt)
                        .catch((ignored) => null);
                    const status = tokenManager.tokenStatus(read, roles);
                    if (!status.valid || read === null) {
                        res.send(401, {error: "unauthorized access"});
                        if (next) {
                            return resolve(next());
                        } else {
                            // @ts-ignore
                            return resolve();
                        }
                    } else {
                        if (status.minuteLeft < 5) {
                            res.header("x-token-renew", status.minuteLeft);
                        }
                        req.identity = await userProvider.userById(read.audience);
                        const prom = original.apply(this, args);
                        if (prom instanceof Promise) {
                            const final = await prom;
                            return resolve(final);
                        }
                        return resolve(prom);
                    }
                } catch (exception: any) {
                    // @ts-ignore
                    if (this.console) {
                        // @ts-ignore
                        this.console.e(target.constructor.name, exception.message);
                    }
                    const errorCode = exception.message.toLowerCase().indexOf('Invalid token') === 0 ? 401 : 500;
                    res.send(errorCode, {error: "server errors", details: exception.message});
                    if (next) {
                        return resolve(next());
                    } else {
                        // @ts-ignore
                        return resolve();
                    }
                }
            });
        };
        return descriptor;
    };
}
