import * as restify from "restify";
import {Request, Response} from "restify";
import {Authorize, AuthorizedRequest, Get, ok, RestController} from "../../lib/base";

export class DefaultStatsController extends RestController {

    constructor(server: restify.Server) {
        super(server, "stats");
    }

    @Get("echo")
    async testEcho(req: Request, res: Response) {
        return ok(res, {done: true, date: new Date().toISOString()});
    }

    @Get("user")
    @Authorize()
    async testAuth(req: AuthorizedRequest, res: Response) {
        return ok(res, {done: true, date: new Date().toISOString(), user: req.identity});
    }
}
