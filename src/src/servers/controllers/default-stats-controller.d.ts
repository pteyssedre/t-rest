import { Request, Response } from "restify";
import * as restify from "restify";
import { AuthorizedRequest, RestController } from "../../lib/base";
export declare class DefaultStatsController extends RestController {
    constructor(server: restify.Server);
    testEcho(req: Request, res: Response): Promise<any>;
    testAuth(req: AuthorizedRequest, res: Response): Promise<any>;
}
