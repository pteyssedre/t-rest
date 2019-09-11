import * as restify from "restify";
import { Request, Response } from "restify";
import { RestController } from "../../lib";
export declare class DefaultAccountController extends RestController {
    private readonly tokenManager;
    private readonly userProvider;
    private readonly tokenProvider;
    constructor(server: restify.Server, version: string);
    login(req: Request, res: Response): Promise<any>;
    register(req: Request, res: Response): Promise<any>;
}
