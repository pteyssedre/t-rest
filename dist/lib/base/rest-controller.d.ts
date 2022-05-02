import * as restify from "restify";
import { Next, Request, Response } from "restify";
export declare enum UserRole {
    None = 0,
    User = 1,
    SuperUser = 2,
    Admin = 15
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
export declare abstract class RestController {
    protected pathBase: string;
    protected version: string;
    protected server: restify.Server;
    private readonly apiPrefix;
    private readonly logOptions;
    private readonly console;
    protected constructor(server: restify.Server, pathBase: string, version?: string);
    postRequest(path: string, prom: (req: Request, res: Response, next: Next) => Promise<any>): void;
    getRequest(path: string, prom: (req: Request, res: Response, next: Next) => Promise<any>): void;
    patchRequest(path: string, prom: (req: Request, res: Response, next: Next) => Promise<any>): void;
    deleteRequest(path: string, prom: (req: Request, res: Response, next: Next) => Promise<any>): void;
    setupRoutes(): void;
    protected promiseHandler(prom: (req: Request, res: Response, next: Next) => Promise<any>, req: Request, res: Response, next: Next): Promise<any>;
    private getFullPath;
}
