import {Response} from "restify";

export function created(rep: Response, data: any) {
    return rep.send(201, data);
}

export function accepted(rep: Response, data: any) {
    return rep.send(202, data);
}

export function ok(rep: Response, data: any) {
    return rep.send(200, data);
}

export function notModified(rep: Response, data: any) {
    return rep.send(304, data);
}

export function notFound(rep: Response, data: any) {
    return rep.send(404, data);
}

export function notAuthorized(rep: Response, data: any) {
    return rep.send(401, data);
}

export function forbidden(rep: Response, data: any) {
    return rep.send(403, data);
}

export function badRequest(rep: Response, data: any) {
    return rep.send(400, data);
}

export function error(rep: Response, data: any) {
    return rep.send(500, data);
}
