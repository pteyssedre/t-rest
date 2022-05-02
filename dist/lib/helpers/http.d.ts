/// <reference types="node" />
import { ReadStream } from "fs";
import { IncomingMessage } from "http";
import { UrlWithStringQuery } from "url";
export declare class HttpResponse extends IncomingMessage {
    data: string;
    file: ReadStream;
    get json(): any;
}
export interface HttpRequest extends UrlWithStringQuery {
    method?: string;
    headers?: any;
    tmpFolder?: string;
    raw?: boolean;
}
export interface HttpOptionsRequest {
    headers?: {
        [key: string]: string;
    };
    tmpFolder?: string;
    raw?: boolean;
}
export declare enum HttpTypeRequest {
    JSON = "application/json",
    FORM = "application/x-www-form-urlencoded"
}
export declare class HttpClient {
    static get(uri: string, options?: HttpOptionsRequest): Promise<HttpResponse>;
    static post(uri: string, data: any, type?: HttpTypeRequest, opts?: HttpOptionsRequest): Promise<HttpResponse>;
    private static deferrer;
}
