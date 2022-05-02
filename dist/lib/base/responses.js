"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.error = exports.badRequest = exports.forbidden = exports.notAuthorized = exports.notFound = exports.notModified = exports.ok = exports.accepted = exports.created = void 0;
function created(rep, data) {
    return rep.send(201, data);
}
exports.created = created;
function accepted(rep, data) {
    return rep.send(202, data);
}
exports.accepted = accepted;
function ok(rep, data) {
    return rep.send(200, data);
}
exports.ok = ok;
function notModified(rep, data) {
    return rep.send(304, data);
}
exports.notModified = notModified;
function notFound(rep, data) {
    return rep.send(404, data);
}
exports.notFound = notFound;
function notAuthorized(rep, data) {
    return rep.send(401, data);
}
exports.notAuthorized = notAuthorized;
function forbidden(rep, data) {
    return rep.send(403, data);
}
exports.forbidden = forbidden;
function badRequest(rep, data) {
    return rep.send(400, data);
}
exports.badRequest = badRequest;
function error(rep, data) {
    return rep.send(500, data);
}
exports.error = error;
