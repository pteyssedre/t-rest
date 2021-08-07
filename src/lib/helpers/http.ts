import * as fs from "fs";
import {ReadStream} from "fs";
import * as http from "http";
import {IncomingMessage} from "http";
import * as https from "https";
import * as path from "path";
import * as querystring from "querystring";
import * as url from "url";
import {UrlWithStringQuery} from "url";
import {Guid} from "./guid";

export class HttpResponse extends IncomingMessage {
    data: string;
    file: ReadStream;

    get json() {
        return JSON.parse(this.data);
    }
}

export interface HttpRequest extends UrlWithStringQuery {
    method?: string;
    headers?: any;
    tmpFolder?: string;
    raw?: boolean;
}

export interface HttpOptionsRequest {
    headers?: { [key: string]: string };
    tmpFolder?: string;
    raw?: boolean;
}

export enum HttpTypeRequest {
    JSON = "application/json",
    FORM = "application/x-www-form-urlencoded",
}

// tslint:disable-next-line:max-classes-per-file
export class HttpClient {

    public static get(uri: string, options: HttpOptionsRequest = {}): Promise<HttpResponse> {
        return new Promise<HttpResponse>((resolve, reject) => {
            let body: string = "";
            const opt = url.parse(uri) as HttpRequest;
            opt.method = "GET";
            Object.assign(options, opt);
            const req = HttpClient.deferrer(uri)(opt, (res) => {
                if (options.raw) {
                    return resolve(res as HttpResponse);
                }
                if (res.headers["content-type"]) {
                    const contentType = res.headers["content-type"];
                    switch (contentType) {
                        case "image/png":
                        case "image/jpg":
                        case "image/jpeg":
                            const baseTmp = options.tmpFolder ? options.tmpFolder : path.join(__dirname, "../tmp");
                            if (!fs.existsSync(baseTmp)) {
                                fs.mkdirSync(baseTmp);
                            }
                            const tmpFile = path.join(baseTmp, "img_tmp_" + Guid.newGuid);
                            const file = fs
                                .createWriteStream(tmpFile);
                            const stream = res.pipe(file);
                            stream.on("finish", function() {
                                const response = res as HttpResponse;
                                response.file = fs.createReadStream(file.path);
                                response.file.on("end", () => {
                                    response.file.close();
                                    if (fs.existsSync(response.file.path)) {
                                        fs.unlinkSync(response.file.path);
                                    }
                                });
                                return resolve(response);
                            });
                            break;
                        default:
                            res.setEncoding("utf-8");
                            res.on("data", (d) => {
                                body += d;
                            });
                            res.on("end", () => {
                                const response = res as HttpResponse;
                                response.data = body;
                                return resolve(response);
                            });
                            res.on("error", () => {
                                return reject(res);
                            });
                            break;
                    }
                }
            });
            req.end();
        });
    }

    public static post(uri: string, data: any,
                       type: HttpTypeRequest = HttpTypeRequest.JSON,
                       opts?: HttpOptionsRequest): Promise<HttpResponse> {
        return new Promise<HttpResponse>((resolve, reject) => {
            let body: string = "";
            let dPost = "";
            const options = url.parse(uri) as HttpRequest;
            options.method = "POST";
            switch (type) {
                case HttpTypeRequest.JSON:
                    dPost = JSON.stringify(data);
                    break;
                case HttpTypeRequest.FORM:
                    dPost = querystring.stringify(data);
                    break;
            }
            if (opts) {
                Object.assign(options, opts);
            }
            if (!options.headers) {
                options.headers = {};
            }
            options.headers["Content-Length"] = Buffer.byteLength(dPost);
            options.headers["Content-Type"] = type.toString();

            const post = HttpClient.deferrer(uri)(options, (res) => {
                res.setEncoding("utf-8");
                res.on("data", (d) => {
                    body += d;
                });
                res.on("end", () => {
                    const response = res as HttpResponse;
                    response.data = body;
                    return resolve(response);
                });
                res.on("error", () => {
                    return reject(res);
                });
            });
            post.write(dPost);
            post.end();
        });
    }

    private static deferrer(uri: string) {
        return uri.indexOf("https") > -1 ? https.request : http.request;
    }
}
