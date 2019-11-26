import * as restify from "restify";
import { Request, Response } from "restify";
import { ApiServerOption } from "../api-server";
export declare class StaticFileController {
    private props;
    constructor(server: restify.Server, props: ApiServerOption);
    matchFile(req: Request, res: Response): any;
    private proxify;
}
