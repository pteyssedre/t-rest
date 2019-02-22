import * as restify from "restify";
import { Next, Request, Response } from "restify";
export declare enum UserRole {
    None = 0,
    User = 1,
    SuperUser = 2,
    Admin = 15
}
export interface RestUser {
}
export interface UserProvider {
    userById(id: number | string): RestUser;
}
export interface AuthorizedRequest extends Request {
    identity: RestUser;
}
export declare abstract class RestController {
    protected pathBase: string;
    protected apiPath: string;
    protected server: restify.Server;
    protected constructor(server: restify.Server, pathBase: string);
    postRequest(path: string, prom: (req: Request, res: Response, next: Next) => Promise<any>): void;
    getRequest(path: string, prom: (req: Request, res: Response, next: Next) => Promise<any>): void;
    patchRequest(path: string, prom: (req: Request, res: Response, next: Next) => Promise<any>): void;
    deleteRequest(path: string, prom: (req: Request, res: Response, next: Next) => Promise<any>): void;
    setupRoutes(): void;
    protected promiseHandler(prom: (req: Request, res: Response, next: Next) => Promise<any>, req: Request, res: Response, next: Next): Promise<any>;
}
export declare function created(rep: Response, data: any): any;
export declare function accepted(rep: Response, data: any): any;
export declare function ok(rep: Response, data: any): any;
export declare function notModified(rep: Response, data: any): any;
export declare function notFound(rep: Response, data: any): any;
export declare function error(rep: Response, data: any): any;
export declare function Delete(path?: string): <T extends RestController>(target: T, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
export declare function Post(path?: string): <T extends RestController>(target: T, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
export declare function Get(path?: string): <T extends RestController>(target: T, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
export declare function Patch(path?: string): <T extends RestController>(target: T, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
export declare function Authorize(...roles: UserRole[]): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
