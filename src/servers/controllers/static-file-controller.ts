import * as fs from "fs";
import * as path from "path";
import * as restify from "restify";
import {Request, Response} from "restify";
import {HttpClient} from "../../lib/helpers/http";
import {ApiServerOption} from "../api-server";

const mime = require("mime-types");

export class StaticFileController {

    constructor(server: restify.Server, private props: ApiServerOption) {
        if (!this.props.public) {
            throw new Error("public path is not set");
        }
        server.get("/*", (req, res) => {
            try {
                if (this.props.proxy) {
                    const data = Object.keys(this.props.proxy);
                    const p = req.path();
                    const match = data.filter((e: string) => p.indexOf(e) === 0).shift();
                    if (match) {
                        return this.proxify(this.props.proxy[match], req, res);
                    }
                }
                return this.matchFile(req, res);
            } catch (e) {
                console.error("[StaticFileController]", e.message);
                return res.send(404);
            }
        });
    }

    matchFile(req: Request, res: Response) {
        let strPattern = "/.*\\.css|.*\\.html|.*\\.js|.*\\.png|.*\\.svg|.*\\.ico|.*\\.jpeg|.*\\.jpg|.*\\.woff|.*\\.woff2|.*\\.ttf/";
        if (this.props.extensionsAllowed) {
            strPattern = "";
            for (let i = 0; i < this.props.extensionsAllowed.length; i++) {
                const ext = this.props.extensionsAllowed[i];
                if (strPattern.indexOf(ext) === -1) {
                    strPattern += `(!?\\.${ext})${(i + 1) < this.props.extensionsAllowed.length ? "|" : ""}`;
                }
            }
        }
        const isFile = new RegExp(strPattern);
        let p = this.props.defaultFile ? this.props.defaultFile : "index.html";
        if (isFile.test(req.path())) {
            p = req.path();
        }
        if (!this.props.public) {
            throw new Error("public path is not set");
        }
        const filePath = path.join(this.props.public, p);
        if (!fs.existsSync(filePath)) {
            return res.send(404);
        }
        const stat = fs.statSync(filePath);

        res.writeHead(200, {
            "Content-Length": stat.size,
            "Content-Type": mime.lookup(p),
        });

        const readStream = fs.createReadStream(filePath);
        readStream.pipe(res);
    }

    private proxify(proxyElement: { target: string }, req: Request, res: Response) {
        const q = req.getQuery();
        const uri = `${proxyElement.target}${req.path()}${q ? `?${q}` : ""}`;
        return HttpClient.get(uri, {raw: true})
            .then((response) => {
                res.writeHead(Number(response.statusCode), response.headers);
                return response.pipe(res);
            }).catch((error) => {
                return res.send(500, error.message);
            });
    }
}
