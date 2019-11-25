import * as restify from "restify";
import { Request, Response } from "restify";
import { SpaServerOptions } from "../SpaServer";
export declare class StaticFileController {
    private props;
    private readonly mainPath;
    constructor(server: restify.Server, props: SpaServerOptions);
    matchFile(req: Request, res: Response): void;
}
