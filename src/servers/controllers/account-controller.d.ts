import * as restify from "restify";
import { Request, Response } from "restify";
import { RestController } from "../../lib";
export declare class AccountController extends RestController {
    private readonly tokenManager;
    private readonly userProvider;
    private readonly tokenProvider;
    constructor(server: restify.Server, path: string, version: string);
    login(req: Request, res: Response): Promise<any>;
    register(req: Request, res: Response): Promise<any>;
}
