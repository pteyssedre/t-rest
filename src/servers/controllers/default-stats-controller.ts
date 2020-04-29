import * as restify from "restify";
import {Request, Response} from "restify";
import {Authorize, AuthorizedRequest, Get, ok, Post, RestController} from "../../lib/base";

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

    @Post("user")
    @Authorize()
    async testPost(req: AuthorizedRequest, res: Response) {
        return ok(res, req.body);
    }

    @Post("500")
    @Authorize()
    async testErrorPost(req: AuthorizedRequest, res: Response) {
        throw new Error("automatic error validation");
    }
}
