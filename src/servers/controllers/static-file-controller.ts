import * as fs from "fs";
import * as path from "path";
import * as restify from "restify";
import {Request, Response} from "restify";
import {SpaServerOptions} from "../SpaServer";

const mime = require("mime-types");

export class StaticFileController {

    private readonly mainPath: string;

    constructor(server: restify.Server, private props: SpaServerOptions) {
        this.mainPath = props.filePath;
        server.get("/*", (req, res) => {
            return this.matchFile(req, res);
        });
    }

    matchFile(req: Request, res: Response) {
        const isFile = new RegExp("/.*\\.css|.*\\.html|.*\\.js|.*\\.png|.*\\.ico|.*\\.jpeg|.*\\.jpg|.*\\.woff|.*\\.woff2|.*\\.ttf/");
        let p = this.props.defaultFile ? this.props.defaultFile : "index.html";
        if (isFile.test(req.path())) {
            p = req.path();
        }
        const filePath = path.join(this.mainPath, p);
        const stat = fs.statSync(filePath);

        res.writeHead(200, {
            "Content-Length": stat.size,
            "Content-Type": mime.lookup(p),
        });

        const readStream = fs.createReadStream(filePath);
        readStream.pipe(res);
    }
}
